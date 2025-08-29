import React, { useState } from 'react';
import { useOnboarding } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { IconMessageCircle, IconHeart } from '../constants';
import { Textarea } from './Form/Textarea';
import type { TribePostData, PostReply } from '../types';

interface TribePostProps {
  post: TribePostData;
}

const MOCK_USER_ID = 'currentUser'; // Simulate a logged-in user

export const TribePost: React.FC<TribePostProps> = ({ post }) => {
    const { setPosts, setEngagementCount } = useOnboarding();
    const { t } = useLanguage();
    
    const [showReplies, setShowReplies] = useState(false);
    const [newReplyContent, setNewReplyContent] = useState('');
    
    // Check if the current mock user has liked this post
    const isLikedByCurrentUser = post.likedBy.includes(MOCK_USER_ID);

    const handleLike = () => {
        if (isLikedByCurrentUser) return;

        setPosts(prevPosts => prevPosts.map(p => {
            if (p.id === post.id) {
                return {
                    ...p,
                    engagementScore: p.engagementScore + 1,
                    likedBy: [...p.likedBy, MOCK_USER_ID]
                };
            }
            return p;
        }));
        setEngagementCount(prev => prev + 1);
    };

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReplyContent.trim()) return;

        const newReply: PostReply = {
            id: `reply_${Date.now()}`,
            authorName: 'Well-Be Member', // In a real app, this would be the current user's name
            content: newReplyContent,
            createdAt: new Date().toISOString(),
        };

        setPosts(prevPosts => prevPosts.map(p => {
             if (p.id === post.id) {
                return { ...p, replies: [...p.replies, newReply] };
            }
            return p;
        }));
        setEngagementCount(prev => prev + 1);
        setNewReplyContent('');
        setShowReplies(true);
    };

    return (
        <div className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0 animate-fade-in-up">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {post.authorName[0]}
                </div>
                <div className="flex-1">
                    <p className="font-bold font-roboto text-text-dark">{post.authorName}</p>
                    <p className="text-text-light mt-1 whitespace-pre-wrap">{post.content}</p>
                    <p className="text-xs text-neutral mt-2">{new Date(post.createdAt).toLocaleString()}</p>

                    <div className="flex items-center gap-4 mt-3">
                        <button 
                            onClick={() => setShowReplies(!showReplies)} 
                            className="flex items-center text-sm text-text-light hover:text-primary transition-colors"
                        >
                            <IconMessageCircle className="w-4 h-4 mr-1.5" /> {post.replies.length}
                        </button>
                        <button 
                            onClick={handleLike} 
                            disabled={isLikedByCurrentUser}
                            className={`flex items-center text-sm transition-colors ${isLikedByCurrentUser ? 'text-primary' : 'text-text-light hover:text-primary'}`}
                        >
                            <IconHeart 
                                className={`w-4 h-4 mr-1.5 transition-all ${isLikedByCurrentUser ? 'text-primary fill-current' : ''}`}
                            /> 
                            {post.engagementScore}
                        </button>
                    </div>
                </div>
            </div>

            {showReplies && (
                <div className="ml-12 mt-4 space-y-4 pt-4 border-t border-dashed">
                    {post.replies.map((reply) => (
                        <div key={reply.id} className="text-sm p-3 bg-background-light rounded-lg animate-fade-in">
                           <p className="font-semibold text-text-dark">{reply.authorName}</p>
                           <p className="text-text-light">{reply.content}</p>
                        </div>
                    ))}

                    <form onSubmit={handleReplySubmit} className="flex gap-2 mt-3">
                        <Textarea
                            placeholder={t('forum_reply_placeholder')}
                            value={newReplyContent}
                            onChange={(e) => setNewReplyContent(e.target.value)}
                            className="flex-1 text-sm"
                            rows={1}
                            required
                        />
                        <button type="submit" className="bg-success text-white font-roboto text-sm font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition">
                            {t('forum_reply
