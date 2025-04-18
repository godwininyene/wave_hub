  import "@babel/polyfill"
  import "toastify-js/src/toastify.css"
  import {login} from './login'
  import { getSidebarPosts } from "./sidebarPosts";
  import { createComment } from "./comment";
  import { getCategories } from "./category";
  import { createSubscription } from "./subscription";
  // =========================== Init AOS =========================== //
  AOS.init({
    once: true,
    offset: 50,
    disable: "tablet",
  });

  // =========================== Start of Login =========================== //
  const loginForm = document.querySelector('#login-form');
  if(loginForm){
    loginForm.addEventListener("submit", async e =>{
      e.preventDefault();
      document.querySelector("#login-btn").innerHTML+=`<i class="fas fa-circle-notch animate-spin duration-1000">`;
      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;
      await login(email, password)
      document.querySelector("#login-btn").innerHTML='';
      document.querySelector("#login-btn").textContent = "LOGIN"
    });
  }
  // =========================== End of Login =========================== //


  // =========================== Start of Comment Form =========================== //
  const commentForm = document.querySelector('.comment-form');
  if(commentForm){
    commentForm.addEventListener('submit', async e=>{
      e.preventDefault();
      document.querySelector(".add-comment-btn").innerHTML+=`<i class="fas fa-circle-notch animate-spin duration-1000">`;
      const author = document.querySelector('#comment_author').value;
      const comment = document.querySelector('#comment_content').value;
      const email = document.querySelector('#email').value;
      const authorId = document.querySelector('#authorId').value;
      const id = e.target.dataset.id; 
      await createComment(id, {author, email, comment, authorId});
      document.querySelector(".add-comment-btn").innerHTML='';
      document.querySelector(".add-comment-btn").textContent='Submit'
      e.target.reset();
    })
  }
  // =========================== Start of Comment Form =========================== //

  // =========================== Start of Subscription Form =========================== //
  document.addEventListener("DOMContentLoaded",  ()=> {
    const forms = document.querySelectorAll(".subscription-form"); // Select both forms by class
    forms.forEach((form) => {
      form.addEventListener("submit",  async event=> {
        event.preventDefault();
        const btn = form.querySelector('.subscription-btn');
        btn.innerHTML+=`<i class="fas fa-circle-notch animate-spin duration-1000">`;
        const name = form.querySelector("#name").value;
        const email = form.querySelector("#email").value;
        await createSubscription({name, email});
        btn.textContent='Submit';
        event.target.reset();
      });
    });
  });

  // =========================== End of Subscription Form =========================== //

  


  // =========================== Start of Sidebar Posts =========================== //
    getSidebarPosts('recent');
    getSidebarPosts('popular');
  // =========================== End of Sidebar Posts =========================== //


  // =========================== Start of Categories=========================== //
  const categoriesList = document.querySelector('.main_category_list');
  const sidebar_category_list  = document.querySelector('.sidebar_category_list ');
  if(categoriesList){
    getCategories(categoriesList, 'home-categories')
  }

  if(sidebar_category_list){
    getCategories(sidebar_category_list, 'sidebar')
  }
  // =========================== End of Categories=========================== //
 
  

  window.addEventListener('load', e =>{
    setTimeout(()=>{
      const currentPath = window.location.pathname;  
      const links = document.querySelectorAll('.cat_links');
      for(let i = 0; i < links.length; i++){
        const link = links[i]
        if (link.getAttribute("href") === currentPath) {
          link.classList.add("bg-primary", "text-white");
          break;
          
        } else {
          link.classList.remove("bg-primary", "text-white");
        }
      }  
    }, 1000)
  });
 // =========================== End of Categories =========================== //

 // =========================== Start of Header =========================== //
    // Header indicator position state
    const headerRef = document.querySelector(".header");
    const navRef = headerRef.querySelector(".navbar");
    const linkRef = navRef.querySelectorAll("a");
    const activeLinkRef = navRef.querySelector(".active");
    const navIndicatorRef = headerRef.querySelector(".indicator");
    const hideOnScrollRef = headerRef.querySelectorAll(".hideOnScroll");
    const navIcon = document.querySelector('.nav-icon');
    let indicatorPosition = null;
  
    const navTogglerRef = headerRef.querySelector(".navToggler");
  
    // Function to set indicator position
    const setIndicatorPosition = (left, width) => {
      indicatorPosition = { left, width };
      navIndicatorRef.style.left = `${indicatorPosition.left}px`;
      navIndicatorRef.style.width = `${indicatorPosition.width}px`;    
    };
  
    // Update indicator position when active link changes
    window.addEventListener("load", () => {
      if (activeLinkRef) {
        setIndicatorPosition(activeLinkRef.offsetLeft, activeLinkRef.offsetWidth);
      }
      setTimeout(() => {
        
        navIndicatorRef.style.opacity = 1;
        navIndicatorRef.style.transform = "scaleX(1)";
      }, 300);
    });
  
    // Handle mouse leave event
    const handleLinkMouseLeave = () => {
     
      if (activeLinkRef) {
        setIndicatorPosition(activeLinkRef.offsetLeft, activeLinkRef.offsetWidth);
       
      }
    };
    navRef.addEventListener("mouseleave", handleLinkMouseLeave);
  
    // Handle mouse enter event
    const handleLinkMouseEnter = (event) => {
      const link = event.currentTarget;
      setIndicatorPosition(link.offsetLeft, link.offsetWidth);
    };
  
    // Handle link click event
    const handleLinkClick = (event) => {
       
      const link = event.currentTarget;
      // Remove active class from all links
      linkRef.forEach((lnk) => lnk.classList.remove("active"));
      // Add active class to the clicked link
      link.classList.add("active");
      // Update active link reference
      activeLinkRef = link;
      // Update the indicator position
      setIndicatorPosition(link.offsetLeft, link.offsetWidth);
    };

    window.addEventListener("load", () => {
      const currentPath = window.location.pathname;
      
      linkRef.forEach((link) => {
        if (link.getAttribute("href") === currentPath) {
          link.classList.add("active");
          setIndicatorPosition(link.offsetLeft, link.offsetWidth);
        } else {
          link.classList.remove("active");
        }
      });
    });
    
  
    linkRef.forEach((link) => {
      link.addEventListener("mouseenter", handleLinkMouseEnter);
      // link.addEventListener("click", handleLinkClick);
    });
  
    // Update Header element position on Scroll
    hideOnScrollRef.forEach((element) => {
      const handleScroll = () => {
        window.scrollY > 10
          ? element.classList.add("scrolled")
          : element.classList.remove("scrolled");
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    });
  
    // Open-Close Mobile Nav state
    let mobileNavOpen = false;
    const html = document.documentElement;
    const toggleMobileNav = () => {
      mobileNavOpen = !mobileNavOpen;
      if (mobileNavOpen) {
        html.classList.add("overflow-hidden");
        headerRef.classList.add("navOpen");
        navIcon.classList.add('fa-close')
      } else {
        html.classList.remove("overflow-hidden");
        headerRef.classList.remove("navOpen");
        navIcon.classList.remove('fa-close')
      }
    };
    navTogglerRef.addEventListener("click", toggleMobileNav);
  

    // Change Header background color on scroll
    window.addEventListener("load", () => {
      const banner = document.querySelector(".banner");
      const headerRef = document.querySelector(".header");

      if (!banner || !headerRef) return; // Ensure both elements exist

      const bannerOffsetTop = banner.offsetTop + banner.offsetHeight; // Total position where banner ends
      let lastScrollTop = 0; // Keep track of the last scroll position

      const handleScroll = () => {
        const currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        // Check if the user scrolled past the banner
        if (currentScrollTop > bannerOffsetTop) {
          headerRef.classList.add("invisible");
          headerRef.classList.remove("visible");
        } else {
          headerRef.classList.remove("invisible");
          headerRef.classList.add("visible");
        }

        // Check if the user is scrolling up or down
        if (currentScrollTop > lastScrollTop) {
          headerRef.classList.add("invisible");
        } else {
          headerRef.classList.remove("invisible");
        }

        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // Reset last scroll position
      };

      window.addEventListener("scroll", handleScroll);
    });

  // =========================== End of Header =========================== //

  // =========================== Start of Banner =========================== //
  const handleBannerScroll = () => {
    const bannerTextRef = document.querySelector(".banner .bg-text");
    if (bannerTextRef !== null) {
      const scrollValue = window.scrollY;
      bannerTextRef.style.opacity = (1000 - scrollValue) / 1000;
      bannerTextRef.style.transform = `translateX(-${scrollValue}px)`;
    }
  };
  window.addEventListener("scroll", handleBannerScroll);
  // =========================== End of Banner =========================== //
