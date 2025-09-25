import React from 'react';
import CommunityStories from './CommunityStories';
import SuccessStories from './SuccessStories';
import BlogRecommendations from './BlogRecommendations';

const blogs = () => {
    return (
        <div >
            <section>
            <SuccessStories></SuccessStories>
            </section>
            <section>
            <CommunityStories  >
            </CommunityStories  >             
            </section>
            <section>
            <BlogRecommendations  >
            </BlogRecommendations >             
            </section>
            
        </div>
    );
};

export default blogs;