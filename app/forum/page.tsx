// app/forum/page.tsx
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MuzquizLogo } from '@/components/MuzquizLogo';
import { TIER_LIMITS, normalizeTier } from '@/types';
import Link from 'next/link';

// ── Types ──────────────────────────────────────────────────────────────────────

interface ForumPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  replies_count: number;
  author: { nickname: string; avatar_color: string };
}

interface ForumReply {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  author: { nickname: string; avatar_color: string };
}

interface SharedPack {
  id: string;
  name: string;
  description: string;
  mode: string;
  shared_description: string;
  question_count: number;
  owner_nickname: string;
  owner_color: string;
  created_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  author: { nickname: string; avatar_color: string };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'à l\'instant';
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `il y a ${d}j`;
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

const MODE_LABEL: Record<string, string> = {
  qcm: 'Quiz', buzz: 'Buzz Quiz', quiz: 'Quiz',
  blind_test: 'Blind Test', buzz_quiz: 'Buzz Quiz', buzz_blind_test: 'Buzz Blind Test',
};
const MODE_COLOR: Record<string, string> = {
  qcm: '#00E5D1', buzz: '#FF00AA', quiz: '#00E5D1',
  blind_test: '#8B5CF6', buzz_quiz: '#FF00AA', buzz_blind_test: '#F59E0B',
};

// ── Composant principal ───────────────────────────────────────────────────────

function ForumPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'packs' ? 'packs' : searchParams.get('tab') === 'blog' ? 'blog' : 'forum';
  const [tab, setTab] = useState<'forum' | 'packs' | 'blog'>(initialTab as 'forum' | 'packs' | 'blog');

  // Auth
  const [userId, setUserId] = useState<string | null>(null);
  const [isAnon, setIsAnon] = useState(true);
  const [userTier, setUserTier] = useState<string>('decouverte');
  const [isAdmin, setIsAdmin] = useState(false);

  // ── Forum state ────────────────────────────────────────────────────────────
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [postSaving, setPostSaving] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replySaving, setReplySaving] = useState(false);

  // ── Blog state ─────────────────────────────────────────────────────────────
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [showNewBlog, setShowNewBlog] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImageUrl, setBlogImageUrl] = useState('');
  const [blogSaving, setBlogSaving] = useState(false);

  // ── Packs state ────────────────────────────────────────────────────────────
  const [packs, setPacks] = useState<SharedPack[]>([]);
  const [packsLoading, setPacksLoading] = useState(true);
  const [importing, setImporting] = useState<string | null>(null);
  const [importMsg, setImportMsg] = useState<{ packId: string; ok: boolean; text: string } | null>(null);
  const [search, setSearch] = useState('');

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const ADMIN_EMAILS = ['antoine.gegedu27@gmail.com', 'dimitte-14@hotmail.fr', 'lacaravanegame@gmail.com'];
      if (session?.user && !session.user.is_anonymous) {
        setUserId(session.user.id);
        setIsAnon(false);
        if (ADMIN_EMAILS.includes(session.user.email ?? '')) setIsAdmin(true);
        const { data: prof } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', session.user.id)
          .single();
        if (prof) setUserTier(normalizeTier(prof.subscription_tier));
      } else if (session?.user) {
        setUserId(session.user.id);
        setIsAnon(true);
      }
    };
    init();
    loadPosts();
    loadPacks();
    loadBlog();
  }, []);

  // ── Forum actions ──────────────────────────────────────────────────────────

  const loadPosts = async () => {
    setPostsLoading(true);
    const { data } = await supabase
      .from('forum_posts')
      .select(`id, title, content, created_at, replies_count, profiles(nickname, avatar_color)`)
      .order('created_at', { ascending: false });
    if (data) {
      setPosts(data.map((p: any) => ({
        ...p,
        author: {
          nickname: p.profiles?.nickname ?? 'Anonyme',
          avatar_color: p.profiles?.avatar_color ?? '#8B5CF6',
        },
      })));
    }
    setPostsLoading(false);
  };

  const openPost = async (post: ForumPost) => {
    setSelectedPost(post);
    setRepliesLoading(true);
    const { data } = await supabase
      .from('forum_replies')
      .select(`id, content, created_at, author_id, profiles(nickname, avatar_color)`)
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });
    if (data) {
      setReplies(data.map((r: any) => ({
        ...r,
        author: {
          nickname: r.profiles?.nickname ?? 'Anonyme',
          avatar_color: r.profiles?.avatar_color ?? '#8B5CF6',
        },
      })));
    }
    setRepliesLoading(false);
  };

  const createPost = async () => {
    if (!newTitle.trim() || !newContent.trim() || !userId) return;
    setPostSaving(true);
    const { error } = await supabase
      .from('forum_posts')
      .insert({ author_id: userId, title: newTitle.trim(), content: newContent.trim() });
    if (!error) {
      setNewTitle(''); setNewContent('');
      setShowNewPost(false);
      await loadPosts();
    }
    setPostSaving(false);
  };

  const createReply = async () => {
    if (!replyContent.trim() || !userId || !selectedPost) return;
    setReplySaving(true);
    await supabase.from('forum_replies').insert({
      post_id: selectedPost.id,
      author_id: userId,
      content: replyContent.trim(),
    });
    setReplyContent('');
    await openPost(selectedPost);
    setReplySaving(false);
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Supprimer ce sujet et toutes ses réponses ?')) return;
    await supabase.from('forum_posts').delete().eq('id', postId);
    setSelectedPost(null);
    await loadPosts();
  };

  const deleteReply = async (replyId: string) => {
    await supabase.from('forum_replies').delete().eq('id', replyId);
    if (selectedPost) await openPost(selectedPost);
  };

  // ── Blog actions ───────────────────────────────────────────────────────────

  const loadBlog = async () => {
    setBlogLoading(true);
    const { data } = await supabase
      .from('blog_posts')
      .select(`id, title, content, image_url, created_at, profiles(nickname, avatar_color)`)
      .order('created_at', { ascending: false });
    if (data) {
      setBlogPosts(data.map((p: any) => ({
        ...p,
        author: {
          nickname: p.profiles?.nickname ?? 'Anonyme',
          avatar_color: p.profiles?.avatar_color ?? '#8B5CF6',
        },
      })));
    }
    setBlogLoading(false);
  };

  const createBlogPost = async () => {
    if (!blogTitle.trim() || !blogContent.trim() || !userId) return;
    setBlogSaving(true);
    const { error } = await supabase.from('blog_posts').insert({
      author_id: userId,
      title: blogTitle.trim(),
      content: blogContent.trim(),
      image_url: blogImageUrl.trim() || null,
    });
    if (!error) {
      setBlogTitle(''); setBlogContent(''); setBlogImageUrl('');
      setShowNewBlog(false);
      await loadBlog();
    }
    setBlogSaving(false);
  };

  const deleteBlogPost = async (postId: string) => {
    if (!confirm('Supprimer cet article ?')) return;
    await supabase.from('blog_posts').delete().eq('id', postId);
    setSelectedBlog(null);
    await loadBlog();
  };

  // ── Packs actions ──────────────────────────────────────────────────────────

  const loadPacks = async () => {
    setPacksLoading(true);
    const { data, error } = await supabase
      .from('question_packs')
      .select(`id, name, description, mode, shared_description, created_at, profiles!inner(nickname, avatar_color)`)
      .eq('is_shared', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const packsWithCount = await Promise.all(
        data.map(async (pack: any) => {
          const { count } = await supabase
            .from('custom_questions')
            .select('*', { count: 'exact', head: true })
            .eq('pack_id', pack.id);
          return {
            id: pack.id,
            name: pack.name,
            description: pack.description,
            mode: pack.mode,
            shared_description: pack.shared_description ?? '',
            question_count: count ?? 0,
            owner_nickname: pack.profiles?.nickname ?? 'Joueur',
            owner_color: pack.profiles?.avatar_color ?? '#8B5CF6',
            created_at: pack.created_at,
          };
        })
      );
      setPacks(packsWithCount);
    }
    setPacksLoading(false);
  };

  const importPack = async (pack: SharedPack) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user || session.user.is_anonymous) {
      router.push('/login?redirect=/forum?tab=packs');
      return;
    }
    if (userTier === 'decouverte') {
      setImportMsg({ packId: pack.id, ok: false, text: 'Abonnement Essentiel ou supérieur requis pour importer.' });
      return;
    }
    setImporting(pack.id);
    setImportMsg(null);
    try {
      const { data: newPack, error: packErr } = await supabase
        .from('question_packs')
        .insert({ owner_id: session.user.id, name: `${pack.name} (copie)`, description: pack.description, mode: pack.mode })
        .select('id')
        .single();
      if (packErr || !newPack) {
        setImportMsg({ packId: pack.id, ok: false, text: 'Erreur lors de la création du pack.' });
        return;
      }
      const { data: questions } = await supabase
        .from('custom_questions')
        .select('*')
        .eq('pack_id', pack.id);
      if (questions && questions.length > 0) {
        await supabase.from('custom_questions').insert(
          questions.map((q: any) => ({
            pack_id: newPack.id,
            owner_id: session.user.id,
            question: q.question,
            choice_a: q.choice_a,
            choice_b: q.choice_b,
            choice_c: q.choice_c,
            choice_d: q.choice_d,
            correct_index: q.correct_index,
            question_type: q.question_type,
            image_url: q.image_url,
            youtube_url: q.youtube_url,
            audio_start_time: q.audio_start_time,
          }))
        );
      }
      setImportMsg({ packId: pack.id, ok: true, text: 'Pack importé ! Retrouve-le dans tes packs.' });
    } catch {
      setImportMsg({ packId: pack.id, ok: false, text: 'Erreur réseau.' });
    } finally {
      setImporting(null);
    }
  };

  const filteredPacks = packs.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.shared_description.toLowerCase().includes(search.toLowerCase()) ||
    p.owner_nickname.toLowerCase().includes(search.toLowerCase())
  );

  // ── Vue article blog ouvert ────────────────────────────────────────────────
  if (selectedBlog) {
    return (
      <div className="min-h-screen muz-fade-in"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 50%, #0D1B3E 100%)' }}>
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
          <button onClick={() => setSelectedBlog(null)}
            className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'rgba(0,229,209,0.08)', color: 'rgba(0,229,209,0.7)', border: '1px solid rgba(0,229,209,0.2)' }}>
            ← Blog
          </button>
          <MuzquizLogo width={100} textSize="1.2rem" />
          <div style={{ width: 80 }} />
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Image si présente */}
          {selectedBlog.image_url && (
            <div className="w-full rounded-2xl overflow-hidden mb-6" style={{ maxHeight: 320 }}>
              <img src={selectedBlog.image_url} alt={selectedBlog.title}
                className="w-full object-cover" style={{ maxHeight: 320 }} />
            </div>
          )}

          <h1 className="text-2xl font-black leading-snug mb-3" style={{ color: '#F0F4FF' }}>
            {selectedBlog.title}
          </h1>

          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-full flex-shrink-0"
              style={{ background: selectedBlog.author.avatar_color }} />
            <span className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.5)' }}>
              {selectedBlog.author.nickname} · {timeAgo(selectedBlog.created_at)}
            </span>
            {userId && (
              <button onClick={() => deleteBlogPost(selectedBlog.id)}
                className="ml-auto text-xs px-2 py-1 rounded-lg"
                style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.5)' }}>
                ✕ Supprimer
              </button>
            )}
          </div>

          <div className="muz-card p-6">
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(240,244,255,0.8)' }}>
              {selectedBlog.content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Vue sujet ouvert ───────────────────────────────────────────────────────
  if (selectedPost) {
    return (
      <div className="min-h-screen muz-fade-in"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 50%, #0D1B3E 100%)' }}>
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
          <button onClick={() => setSelectedPost(null)}
            className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.7)', border: '1px solid rgba(255,0,170,0.2)' }}>
            ← Forum
          </button>
          <MuzquizLogo width={100} textSize="1.2rem" />
          <div style={{ width: 80 }} />
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="muz-card p-6 mb-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h1 className="text-xl font-black leading-snug flex-1" style={{ color: '#F0F4FF' }}>
                {selectedPost.title}
              </h1>
              {userId && (
                <button onClick={() => deletePost(selectedPost.id)}
                  className="text-xs px-2 py-1 rounded-lg flex-shrink-0"
                  style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.5)' }}>
                  ✕
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full flex-shrink-0"
                style={{ background: selectedPost.author.avatar_color }} />
              <span className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.5)' }}>
                {selectedPost.author.nickname} · {timeAgo(selectedPost.created_at)}
              </span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(240,244,255,0.75)' }}>
              {selectedPost.content}
            </p>
          </div>

          <h2 className="text-sm font-black uppercase tracking-widest mb-4"
            style={{ color: 'rgba(240,244,255,0.35)' }}>
            {selectedPost.replies_count} réponse{selectedPost.replies_count !== 1 ? 's' : ''}
          </h2>

          {repliesLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }} />
            </div>
          ) : (
            <div className="flex flex-col gap-3 mb-6">
              {replies.map(reply => (
                <div key={reply.id} className="muz-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full flex-shrink-0"
                        style={{ background: reply.author.avatar_color }} />
                      <span className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.5)' }}>
                        {reply.author.nickname} · {timeAgo(reply.created_at)}
                      </span>
                    </div>
                    {userId === reply.author_id && (
                      <button onClick={() => deleteReply(reply.id)}
                        className="text-xs" style={{ color: 'rgba(255,0,170,0.4)' }}>✕</button>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ color: 'rgba(240,244,255,0.7)' }}>
                    {reply.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!isAnon ? (
            <div className="muz-card p-5">
              <p className="text-xs font-black uppercase tracking-widest mb-3"
                style={{ color: 'rgba(240,244,255,0.35)' }}>Ta réponse</p>
              <textarea
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder="Écris ta réponse…"
                rows={4}
                className="w-full px-4 py-3 rounded-xl font-medium outline-none resize-none mb-3"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(139,92,246,0.25)', color: '#F0F4FF' }}
              />
              <button onClick={createReply} disabled={replySaving || !replyContent.trim()}
                className="muz-btn-pink py-3 px-6 rounded-xl font-black text-sm disabled:opacity-40">
                {replySaving ? '…' : 'Répondre →'}
              </button>
            </div>
          ) : (
            <div className="text-center py-4 text-sm font-bold" style={{ color: 'rgba(240,244,255,0.35)' }}>
              <Link href="/login?redirect=/forum" style={{ color: '#8B5CF6' }}>Connecte-toi</Link> pour répondre
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Vue principale avec onglets ────────────────────────────────────────────
  return (
    <div className="min-h-screen muz-fade-in"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 50%, #0D1B3E 100%)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
        <Link href="/"
          className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
          style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.7)', border: '1px solid rgba(255,0,170,0.2)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <MuzquizLogo width={18} showText={false} />Accueil
          </span>
        </Link>
        <MuzquizLogo width={100} textSize="1.2rem" />
        <Link href="/profile"
          className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
          style={{ background: 'rgba(139,92,246,0.08)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.2)' }}>
          Profil →
        </Link>
      </div>

      {/* Onglets */}
      <div className="flex border-b" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
        <button
          onClick={() => setTab('forum')}
          className="flex-1 py-3.5 font-black text-sm transition-all"
          style={{
            color: tab === 'forum' ? '#FF00AA' : 'rgba(240,244,255,0.35)',
            borderBottom: tab === 'forum' ? '2px solid #FF00AA' : '2px solid transparent',
          }}>
          Forum
        </button>
        <button
          onClick={() => setTab('packs')}
          className="flex-1 py-3.5 font-black text-sm transition-all"
          style={{
            color: tab === 'packs' ? '#8B5CF6' : 'rgba(240,244,255,0.35)',
            borderBottom: tab === 'packs' ? '2px solid #8B5CF6' : '2px solid transparent',
          }}>
          Packs
        </button>
        <button
          onClick={() => setTab('blog')}
          className="flex-1 py-3.5 font-black text-sm transition-all"
          style={{
            color: tab === 'blog' ? '#00E5D1' : 'rgba(240,244,255,0.35)',
            borderBottom: tab === 'blog' ? '2px solid #00E5D1' : '2px solid transparent',
          }}>
          Blog
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* ── ONGLET FORUM ── */}
        {tab === 'forum' && (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
              <div>
                <h1 className="text-2xl font-black" style={{ color: '#F0F4FF' }}>Discussions</h1>
                <p className="text-sm mt-0.5" style={{ color: 'rgba(240,244,255,0.4)' }}>
                  Idées, questions et retours de la communauté
                </p>
              </div>
              {!isAnon && (
                <button
                  onClick={() => setShowNewPost(true)}
                  className="muz-btn-pink px-4 py-2.5 rounded-xl font-black text-sm flex-shrink-0">
                  + Nouveau sujet
                </button>
              )}
            </div>

            {showNewPost && (
              <div className="muz-card p-5 mb-6">
                <h2 className="text-sm font-black uppercase tracking-widest mb-4"
                  style={{ color: 'rgba(240,244,255,0.35)' }}>Nouveau sujet</h2>
                <div className="flex flex-col gap-3">
                  <input
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="Titre du sujet"
                    maxLength={100}
                    className="w-full px-4 py-3 rounded-xl font-medium outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,0,170,0.3)', color: '#F0F4FF' }}
                  />
                  <textarea
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    placeholder="Décris ton sujet…"
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl font-medium outline-none resize-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,0,170,0.3)', color: '#F0F4FF' }}
                  />
                  <div className="flex gap-3">
                    <button onClick={() => setShowNewPost(false)}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      Annuler
                    </button>
                    <button onClick={createPost} disabled={postSaving || !newTitle.trim() || !newContent.trim()}
                      className="flex-1 muz-btn-pink py-2.5 rounded-xl font-black text-sm disabled:opacity-40">
                      {postSaving ? '…' : 'Publier →'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {postsLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }} />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16" style={{ color: 'rgba(240,244,255,0.3)' }}>
                <p className="text-4xl mb-3" style={{ opacity: 0.3 }}>—</p>
                <p className="font-bold">Aucun sujet pour l'instant.</p>
                <p className="text-sm mt-1 opacity-70">Sois le premier à lancer une discussion !</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {posts.map(post => (
                  <button key={post.id} onClick={() => openPost(post)}
                    className="muz-card muz-card-lift p-4 text-left w-full">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-black text-sm"
                        style={{ background: post.author.avatar_color, color: '#0D1B3E' }}>
                        {post.author.nickname[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-sm mb-1 truncate" style={{ color: '#F0F4FF' }}>
                          {post.title}
                        </p>
                        <p className="text-xs truncate mb-2" style={{ color: 'rgba(240,244,255,0.45)' }}>
                          {post.content}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.35)' }}>
                            {post.author.nickname}
                          </span>
                          <span className="text-xs" style={{ color: 'rgba(240,244,255,0.25)' }}>·</span>
                          <span className="text-xs" style={{ color: 'rgba(240,244,255,0.35)' }}>
                            {timeAgo(post.created_at)}
                          </span>
                          <span className="text-xs" style={{ color: 'rgba(240,244,255,0.25)' }}>·</span>
                          <span className="text-xs font-bold" style={{ color: '#8B5CF6' }}>
                            {post.replies_count} rép.
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {isAnon && (
              <p className="text-center mt-8 text-sm" style={{ color: 'rgba(240,244,255,0.3)' }}>
                <Link href="/login?redirect=/forum" style={{ color: '#8B5CF6' }}>Connecte-toi</Link> pour participer aux discussions
              </p>
            )}
          </>
        )}

        {/* ── ONGLET PACKS ── */}
        {tab === 'packs' && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-black mb-1" style={{ color: '#F0F4FF' }}>Packs communauté</h1>
              <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>
                Packs de questions partagés par les joueurs
              </p>
              {userTier === 'decouverte' && (
                <div className="mt-3 px-4 py-2.5 rounded-xl inline-flex items-center gap-2 text-xs font-bold"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B' }}>
                  👀 Tu peux voir les packs — abonnement Essentiel requis pour importer
                </div>
              )}
            </div>

            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Rechercher un pack, un auteur…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl font-medium outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(139,92,246,0.25)', color: '#F0F4FF' }}
              />
              <Link href="/questions"
                className="px-4 py-3 rounded-xl font-black text-xs flex-shrink-0 flex items-center gap-1.5 transition-all hover:opacity-80"
                style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.25)' }}>
                ↗ Partager un pack
              </Link>
            </div>

            {packsLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }} />
              </div>
            ) : filteredPacks.length === 0 ? (
              <div className="text-center py-16" style={{ color: 'rgba(240,244,255,0.3)' }}>
                <p className="text-4xl mb-3" style={{ opacity: 0.3 }}>—</p>
                <p className="font-bold">
                  {search ? 'Aucun pack ne correspond à ta recherche.' : 'Aucun pack partagé pour l\'instant.'}
                </p>
                <p className="text-sm mt-1 opacity-70">
                  Partage tes packs depuis <Link href="/questions" style={{ color: '#8B5CF6' }}>Mes Questions</Link> !
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredPacks.map(pack => {
                  const modeColor = MODE_COLOR[pack.mode] ?? '#8B5CF6';
                  const msg = importMsg?.packId === pack.id ? importMsg : null;
                  return (
                    <div key={pack.id} className="muz-card p-5 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-black text-base" style={{ color: '#F0F4FF' }}>{pack.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                              style={{ background: `${modeColor}22`, color: modeColor, border: `1px solid ${modeColor}44` }}>
                              {MODE_LABEL[pack.mode]}
                            </span>
                            <span className="text-xs font-bold flex-shrink-0"
                              style={{ color: 'rgba(240,244,255,0.35)' }}>
                              {pack.question_count} question{pack.question_count !== 1 ? 's' : ''}
                            </span>
                          </div>
                          {pack.shared_description && (
                            <p className="text-sm mb-1" style={{ color: 'rgba(240,244,255,0.55)' }}>
                              {pack.shared_description}
                            </p>
                          )}
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full flex-shrink-0"
                              style={{ background: pack.owner_color }} />
                            <span className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>
                              {pack.owner_nickname}
                            </span>
                            <span className="text-xs" style={{ color: 'rgba(240,244,255,0.2)' }}>·</span>
                            <span className="text-xs" style={{ color: 'rgba(240,244,255,0.3)' }}>
                              {timeAgo(pack.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        {msg && (
                          <p className="text-xs font-bold flex-1" style={{ color: msg.ok ? '#00E5D1' : '#FF6060' }}>
                            {msg.ok ? '✓ ' : '✗ '}{msg.text}
                          </p>
                        )}
                        <button
                          onClick={() => importPack(pack)}
                          disabled={importing === pack.id}
                          className="ml-auto shrink-0 px-4 py-2 rounded-xl font-black text-sm transition-all hover:scale-[1.03] disabled:opacity-50"
                          style={{
                            background: userTier === 'decouverte' ? 'rgba(245,158,11,0.1)' : 'rgba(0,229,209,0.1)',
                            color: userTier === 'decouverte' ? '#F59E0B' : '#00E5D1',
                            border: `1px solid ${userTier === 'decouverte' ? 'rgba(245,158,11,0.3)' : 'rgba(0,229,209,0.3)'}`,
                          }}>
                          {importing === pack.id ? '…' : userTier === 'decouverte' ? '🔒 Importer' : '⬇ Importer'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── ONGLET BLOG ── */}
        {tab === 'blog' && (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
              <div>
                <h1 className="text-2xl font-black" style={{ color: '#F0F4FF' }}>Blog</h1>
                <p className="text-sm mt-0.5" style={{ color: 'rgba(240,244,255,0.4)' }}>
                  Articles et actualités de la communauté
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowNewBlog(true)}
                  className="px-4 py-2.5 rounded-xl font-black text-sm flex-shrink-0 transition-all hover:opacity-80"
                  style={{ background: 'rgba(0,229,209,0.1)', color: '#00E5D1', border: '1px solid rgba(0,229,209,0.3)' }}>
                  + Écrire un article
                </button>
              )}
            </div>

            {showNewBlog && (
              <div className="muz-card p-5 mb-6">
                <h2 className="text-sm font-black uppercase tracking-widest mb-4"
                  style={{ color: 'rgba(240,244,255,0.35)' }}>Nouvel article</h2>
                <div className="flex flex-col gap-3">
                  <input
                    value={blogTitle}
                    onChange={e => setBlogTitle(e.target.value)}
                    placeholder="Titre de l'article"
                    maxLength={120}
                    className="w-full px-4 py-3 rounded-xl font-medium outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(0,229,209,0.3)', color: '#F0F4FF' }}
                  />
                  <input
                    value={blogImageUrl}
                    onChange={e => setBlogImageUrl(e.target.value)}
                    placeholder="URL d'une image (optionnel)"
                    className="w-full px-4 py-3 rounded-xl font-medium outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(0,229,209,0.2)', color: '#F0F4FF' }}
                  />
                  <textarea
                    value={blogContent}
                    onChange={e => setBlogContent(e.target.value)}
                    placeholder="Contenu de l'article…"
                    rows={8}
                    className="w-full px-4 py-3 rounded-xl font-medium outline-none resize-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(0,229,209,0.3)', color: '#F0F4FF' }}
                  />
                  <div className="flex gap-3">
                    <button onClick={() => setShowNewBlog(false)}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      Annuler
                    </button>
                    <button onClick={createBlogPost} disabled={blogSaving || !blogTitle.trim() || !blogContent.trim()}
                      className="flex-1 py-2.5 rounded-xl font-black text-sm disabled:opacity-40 transition-all hover:opacity-80"
                      style={{ background: 'rgba(0,229,209,0.15)', color: '#00E5D1', border: '1px solid rgba(0,229,209,0.4)' }}>
                      {blogSaving ? '…' : 'Publier →'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {blogLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: '#00E5D1', borderTopColor: 'transparent' }} />
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-16" style={{ color: 'rgba(240,244,255,0.3)' }}>
                <p className="text-4xl mb-3" style={{ opacity: 0.3 }}>—</p>
                <p className="font-bold">Aucun article pour l'instant.</p>
                {isAdmin && (
                  <p className="text-sm mt-1 opacity-70">Sois le premier à publier !</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {blogPosts.map(post => (
                  <button key={post.id} onClick={() => setSelectedBlog(post)}
                    className="muz-card muz-card-lift text-left w-full overflow-hidden">
                    {post.image_url && (
                      <div className="w-full overflow-hidden" style={{ height: 160 }}>
                        <img src={post.image_url} alt={post.title}
                          className="w-full object-cover h-full" />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="font-black text-base mb-1 leading-snug" style={{ color: '#F0F4FF' }}>
                        {post.title}
                      </p>
                      <p className="text-xs truncate mb-3" style={{ color: 'rgba(240,244,255,0.45)' }}>
                        {post.content}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ background: post.author.avatar_color }} />
                        <span className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.35)' }}>
                          {post.author.nickname}
                        </span>
                        <span className="text-xs" style={{ color: 'rgba(240,244,255,0.2)' }}>·</span>
                        <span className="text-xs" style={{ color: 'rgba(240,244,255,0.35)' }}>
                          {timeAgo(post.created_at)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ForumPage() {
  return (
    <Suspense fallback={null}>
      <ForumPageInner />
    </Suspense>
  );
}
