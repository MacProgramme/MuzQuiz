// app/forum/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MuzquizLogo } from '@/components/MuzquizLogo';
import Link from 'next/link';

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

export default function ForumPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(false);

  // Auth
  const [userId, setUserId] = useState<string | null>(null);
  const [isAnon, setIsAnon] = useState(true);

  // Nouveau sujet
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [postSaving, setPostSaving] = useState(false);

  // Nouvelle réponse
  const [replyContent, setReplyContent] = useState('');
  const [replySaving, setReplySaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        setIsAnon(session.user.is_anonymous ?? true);
      }
      await loadPosts();
    };
    init();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('forum_posts')
      .select(`id, title, content, created_at, replies_count, profiles!inner(nickname, avatar_color)`)
      .order('created_at', { ascending: false });

    if (data) {
      setPosts(data.map((p: any) => ({
        ...p,
        author: { nickname: p.profiles.nickname, avatar_color: p.profiles.avatar_color },
      })));
    }
    setLoading(false);
  };

  const openPost = async (post: ForumPost) => {
    setSelectedPost(post);
    setRepliesLoading(true);
    const { data } = await supabase
      .from('forum_replies')
      .select(`id, content, created_at, author_id, profiles!inner(nickname, avatar_color)`)
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });

    if (data) {
      setReplies(data.map((r: any) => ({
        ...r,
        author: { nickname: r.profiles.nickname, avatar_color: r.profiles.avatar_color },
      })));
    }
    setRepliesLoading(false);
  };

  const createPost = async () => {
    if (!newTitle.trim() || !newContent.trim() || !userId) return;
    setPostSaving(true);
    const { data, error } = await supabase
      .from('forum_posts')
      .insert({ author_id: userId, title: newTitle.trim(), content: newContent.trim() })
      .select(`id, title, content, created_at, replies_count, profiles!inner(nickname, avatar_color)`)
      .single();

    if (!error && data) {
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
    // Recharger les réponses + mettre à jour le count
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

  // ── Vue sujet ouvert ──────────────────────────────────────────
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
          {/* Post original */}
          <div className="muz-card p-6 mb-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h1 className="text-xl font-black leading-snug flex-1" style={{ color: '#F0F4FF' }}>
                {selectedPost.title}
              </h1>
              {userId === selectedPost.author.nickname || userId ? (
                <button onClick={() => deletePost(selectedPost.id)}
                  className="text-xs px-2 py-1 rounded-lg flex-shrink-0"
                  style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.5)' }}>
                  ✕
                </button>
              ) : null}
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

          {/* Réponses */}
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

          {/* Répondre */}
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
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1.5px solid rgba(139,92,246,0.25)',
                  color: '#F0F4FF',
                }}
              />
              <button
                onClick={createReply}
                disabled={replySaving || !replyContent.trim()}
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

  // ── Vue liste des sujets ───────────────────────────────────────
  return (
    <div className="min-h-screen muz-fade-in"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 50%, #0D1B3E 100%)' }}>

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
        <div style={{ width: 80 }} />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-black" style={{ color: '#F0F4FF' }}>💬 Forum</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(240,244,255,0.4)' }}>
              Discussions, idées et questions de la communauté
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

        {/* Formulaire nouveau sujet */}
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
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1.5px solid rgba(255,0,170,0.3)',
                  color: '#F0F4FF',
                }}
              />
              <textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="Décris ton sujet…"
                rows={5}
                className="w-full px-4 py-3 rounded-xl font-medium outline-none resize-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1.5px solid rgba(255,0,170,0.3)',
                  color: '#F0F4FF',
                }}
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

        {/* Liste des sujets */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }} />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'rgba(240,244,255,0.3)' }}>
            <p className="text-4xl mb-3">💬</p>
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
                        💬 {post.replies_count}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {!isAnon ? null : (
          <p className="text-center mt-8 text-sm" style={{ color: 'rgba(240,244,255,0.3)' }}>
            <Link href="/login?redirect=/forum" style={{ color: '#8B5CF6' }}>Connecte-toi</Link> pour participer aux discussions
          </p>
        )}
      </div>
    </div>
  );
}
