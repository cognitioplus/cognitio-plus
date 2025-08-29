import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './Card';
import { Textarea } from './Form/Textarea';
import { useOnboarding } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { TribePost } from './TribePost';
import type { TribePostData } from '../types';

export const GrowthTribeForum: React.FC = () => {
  const { posts, setPosts, setEngagementCount } = useOnboarding();
  const { t } = useLanguage();
  const [newPostContent, setNewPostContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: TribePostData = {
      id: `post_${Date.now()}`,
      authorName: isAnonymous ? 'Community Member' : 'Well-Be Member',
      content: newPostContent,
      isAnonymous,
      engagementScore: 0,
      createdAt: new Date().toISOString(),
      replies: [],
      likedBy: [],
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    setEngagementCount(prev => prev + 1);
    setNewPostContent('');
    setIsAnonymous(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 animate-fade-in mt-16">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🌿</span> {t('forum_title')}
          </CardTitle>
          <CardDescription>{t('forum_subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder={t('forum_placeholder')}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[96px]"
              required
            />
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm flex items-center gap-2 text-text-light cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                {t('forum_anonymous_post')}
              </label>
              <button type="submit" className="bg-primary text-white font-roboto font-bold py-2 px-6 rounded-lg hover:bg-primary-accent transition-transform transform hover:scale-105">
                {t('forum_share_button')}
              </button>
            </div>
          </form>

          <div className="space-y-6 mt-8 border-t pt-6">
            {isLoading ? (
              <p className="text-text-light text-center py-4">{t('forum_loading')}</p>
            ) : posts.length === 0 ? (
              <p className="text-text-light text-center py-8">{t('forum_no_posts')}</p>
            ) : (
              posts.map((post) => (
                <TribePost key={post.id} post={post} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
