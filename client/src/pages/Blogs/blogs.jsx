import React from 'react';
import CommunityStories from './CommunityStories';
import SuccessStories from './SuccessStories';

const blogs = () => {
    return (
        <div className=''>
            <section>
            <SuccessStories></SuccessStories>
            </section>
            <section>
            <CommunityStories  >
            </CommunityStories  >             
            </section>
            
        </div>
    );
};

export default blogs;