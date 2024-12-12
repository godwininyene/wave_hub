import axios from 'axios';

export const getSidebarPosts = async (type) => {
    let url; 
    let container;

    if(type === 'recent'){
        url ='/api/v1/posts/top-5-recent';
        container = document.querySelector('#recent-posts-sidebar-container');
    }else if(type === 'popular'){
        url = '/api/v1/posts/top-5-popular'
        container = document.querySelector('#popular-posts-sidebar-container');
    }
    
  const res = await axios.get(url);
  const posts = res.data.data.posts;

  if (container) {
    posts.forEach(post => {
      const el = `
        <div class="post-widget border-t border-t-slate-300 mb-5 float-left w-full relative pt-3">
          <div class="post-media w-[30%] float-left overflow-hidden rounded">
            <a href="/post/${post.slug}" class="relative block group">
              <img src="/images/posts/${post.coverImage}" class="w-full h-full object-cover" />
              <span class="inline-block w-full h-full absolute top-0 left-0 bottom-0 right-0 z-[2] transition-all duration-200 ease-linear opacity-0 bg-[rgba(0,0,0,0.5)] group-hover:opacity-100"></span>
              <span class="inline-block text-center text-white h-10 w-10 leading-10 rounded-full absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 z-[3] bg-primary transition-all duration-200 ease-linear opacity-0 group-hover:opacity-100" style='box-shadow:0px 0px 0px 4px rgba(255,255,255,0.4)'>
                <i class="fas fa-caret-right"></i>
              </span>
            </a>
          </div>
          <div class="post-content float-left w-[70%] pt-2 pl-3">
            <h3 class="font-semibold text-xs text-left transition-all duration-300 hover:text-primary pb-1">
              <a href="/post/${post.slug}" class="">${post.title}</a>
            </h3>
            <ul>
              <li class="float-left mr-2 text-[10px] font-medium uppercase text-slate-400">
                <span class="flex items-center">
                  <i class="fas fa-clock mr-1 text-primary"></i>
                  ${new Date(post.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </li>
              <li class="float-left mr-2 text-[10px] font-medium uppercase text-slate-400">
                <span class="flex items-center">
                  <i class="fas fa-comments mr-1 text-primary"></i>
                  ${post.commentCount}
                </span>
              </li>
              <li class="float-left mr-2 text-[10px] font-medium uppercase text-slate-400">
                <span class="flex items-center">
                  <i class="fas fa-eye mr-1 text-primary"></i>
                    ${post.viewers.length}
                </span>
              </li>
            </ul>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', el);
    });
  }
};
