import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { MessageCircle, Heart, Star } from 'lucide-react';

export function TribePost({ post }) {
  const [replies, setReplies] = useState<any[]>([]);
  const [newReply, setNewReply] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);

    const {  { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('tribe_engagements').insert({
      user_id: user.id,
      post_id: post.id,
      type: 'like'
    });

    await supabase.rpc('increment_engagement', { row_id: post.id });
  };

  const handleReply = async () => {
    if (!newReply.trim()) return;
    const {  { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('tribe_replies').insert({
      post_id: post.id,
      user_id: user.id,
      content: newReply,
      created_at: new Date().toISOString()
    });

    if (!error) {
      setNewReply('');
      fetchReplies();
      setShowReplies(true);

      const {  userData } = await supabase
        .from('user_profiles')
        .select('engagement_check_ins')
        .eq('user_id', user.id)
        .single();

      await supabase
        .from('user_profiles')
        .update({ engagement_check_ins: (userData.engagement_check_ins || 0) + 1 })
        .eq('user_id', user.id);
    }
  };

  const fetchReplies = async () => {
    const { data } = await supabase
      .from('tribe_replies')
      .select('content, created_at, user_id')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });
    setReplies(data || []);
  };

  return (
    <div className="border-b pb-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#b425aa] to-[#f3e329] rounded-full flex items-center justify-center text-white text-sm font-bold">
          {post.author_name ? post.author_name[0].toUpperCase() : 'U'}
        </div>
        <div className="flex-1">
          <p className="font-medium">{post.author_name || 'Community Member'}</p>
          <p className="text-gray-700 mt-1">{post.content}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(post.created_at).toLocaleString()}
          </p>

          <div className="flex items-center gap-4 mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setShowReplies(!showReplies);
                if (!showReplies) fetchReplies();
              }}
            >
              <MessageCircle size={16} /> {replies.length}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLike} 
              disabled={liked}
            >
              <Heart size={16} fill={liked ? "#b425aa" : "none"} className={liked ? "text-red-500" : ""} /> {post.engagement_score || 0}
            </Button>
          </div>
        </div>
      </div>

      {showReplies && (
        <div className="ml-14 mt-4 space-y-3">
          {replies.map((reply, i) => (
            <div key={i} className="text-sm p-3 bg-gray-50 rounded">
              {reply.content}
            </div>
          ))}

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleReply();
            }}
            className="flex gap-2 mt-3"
          >
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Offer support or encouragement..."
              className="flex-1 text-sm p-2 border rounded"
              rows={1}
            />
            <Button type="submit" size="sm" className="bg-green-500 hover:bg-green-600">
              Reply
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
