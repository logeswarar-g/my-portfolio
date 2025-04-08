// Enhanced scroll animations with GSAP
function initScrollAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate sections as they come into view
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      gsap.fromTo(section.querySelectorAll('h2, p, .hover-lift, .skill-tag, .achievement-card'),
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
    
    // Special animation for the portfolio items
    gsap.utils.toArray('.portfolio-item').forEach(item => {
      gsap.fromTo(item,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }
  
  // Enhanced Three.js background with interactive elements
  function enhanceThreeBackground() {
    // Make particles respond to mouse movement
    const mousePosition = new THREE.Vector2();
    
    window.addEventListener('mousemove', (event) => {
      // Convert mouse position to normalized device coordinates
      mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = - (event.clientY / window.innerHeight) * 2 + 1;
      
      // Gentle movement of particles based on mouse position
      if (particles) {
        const positions = particles.geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
          // Calculate distance from mouse
          const distance = Math.sqrt(
            Math.pow(positions[i] - mousePosition.x * 10, 2) +
            Math.pow(positions[i + 1] - mousePosition.y * 10, 2)
          );
          
          // Move particles away from mouse
          if (distance < 2) {
            positions[i] += mousePosition.x * 0.05;
            positions[i + 1] += mousePosition.y * 0.05;
          }
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
      }
    });
    
    // Add dynamic color changes to particles
    const colors = [0x3B82F6, 0x10B981, 0xEF4444, 0xF59E0B];
    let colorIndex = 0;
    
    setInterval(() => {
      if (particles) {
        colorIndex = (colorIndex + 1) % colors.length;
        particles.material.color.setHex(colors[colorIndex]);
      }
    }, 5000);
  }
  
  // Image lazy loading and preloading
  function initImageOptimization() {
    // Lazy load images
    const images = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
            }
            
            observer.unobserve(img);
          }
        });
      });
      
      images.forEach(img => {
        if (img.getAttribute('src')) {
          img.setAttribute('data-src', img.getAttribute('src'));
          img.removeAttribute('src');
          imageObserver.observe(img);
        }
      });
    }
    
    // Preload critical images
    const preloadImages = ['vip.jpg', 'OIP.jpg', 'OIPP.jpg', 'OIPO.jpg'];
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }
  
  // Smooth navigation with scroll-to animations
  function enhanceNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          gsap.to(window, {
            duration: 1,
            scrollTo: {
              y: targetSection,
              offsetY: 80
            },
            ease: "power3.inOut"
          });
          
          // Update active navigation link
          navLinks.forEach(l => l.classList.remove('text-primary-500'));
          link.classList.add('text-primary-500');
        }
      });
    });
    
    // Highlight active section on scroll
    window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('section');
      let currentSection = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200 && 
            window.pageYOffset < sectionTop + sectionHeight - 200) {
          currentSection = '#' + section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('text-primary-500');
        if (link.getAttribute('href') === currentSection) {
          link.classList.add('text-primary-500');
        }
      });
    });
  }
  
  // Enhanced form validation and animation
  function enhanceContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formInputs = contactForm.querySelectorAll('input, textarea');
    const formStatus = document.getElementById('formStatus');
    
    // Add floating label effect
    formInputs.forEach(input => {
      const wrapper = document.createElement('div');
      wrapper.className = 'relative mb-4';
      
      const label = document.createElement('label');
      label.textContent = input.placeholder;
      label.className = 'absolute left-4 top-4 text-gray-400 transition-all duration-300 pointer-events-none';
      
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
      wrapper.appendChild(label);
      
      input.addEventListener('focus', () => {
        label.classList.add('text-xs', 'text-primary-500', '-translate-y-3');
      });
      
      input.addEventListener('blur', () => {
        if (!input.value) {
          label.classList.remove('text-xs', 'text-primary-500', '-translate-y-3');
        }
      });
      
      // Check for existing value (e.g., after failed submission)
      if (input.value) {
        label.classList.add('text-xs', 'text-primary-500', '-translate-y-3');
      }
    });
    
    // Enhanced form submission with validation and animation
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate inputs
      let isValid = true;
      formInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('border-red-500');
          setTimeout(() => input.classList.remove('border-red-500'), 3000);
        }
      });
      
      if (!isValid) {
        gsap.fromTo(contactForm,
          { x: 0 },
          { x: 10, duration: 0.1, repeat: 5, yoyo: true }
        );
        formStatus.textContent = 'Please fill all required fields';
        formStatus.className = 'text-red-500 mt-4 text-center';
        formStatus.classList.remove('hidden');
        return;
      }
      
      // Email validation
      const emailInput = contactForm.querySelector('input[type="email"]');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value)) {
        emailInput.classList.add('border-red-500');
        setTimeout(() => emailInput.classList.remove('border-red-500'), 3000);
        formStatus.textContent = 'Please enter a valid email address';
        formStatus.className = 'text-red-500 mt-4 text-center';
        formStatus.classList.remove('hidden');
        return;
      }
      
      try {
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Animate submission (simulated success for demo)
        formStatus.classList.remove('hidden');
        formStatus.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending message...';
        formStatus.className = 'text-blue-500 mt-4 text-center';
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success animation
        formStatus.innerHTML = '<i class="fas fa-check-circle mr-2"></i> Message sent successfully!';
        formStatus.className = 'text-green-500 mt-4 text-center';
        
        // Reset form with animation
        gsap.fromTo(formInputs, 
          { opacity: 1 },
          { opacity: 0, duration: 0.3, stagger: 0.1, onComplete: () => {
            contactForm.reset();
            gsap.to(formInputs, { opacity: 1, duration: 0.3, stagger: 0.1 });
            // Reset labels
            document.querySelectorAll('label').forEach(label => {
              label.classList.remove('text-xs', 'text-primary-500', '-translate-y-3');
            });
          }}
        );
        
        // Hide success message after delay
        setTimeout(() => {
          gsap.to(formStatus, { opacity: 0, duration: 0.5, onComplete: () => {
            formStatus.classList.add('hidden');
            formStatus.style.opacity = 1;
          }});
        }, 4000);
        
      } catch (error) {
        formStatus.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i> An error occurred. Please try again.';
        formStatus.className = 'text-red-500 mt-4 text-center';
        formStatus.classList.remove('hidden');
      }
    });
  }
  
  // Theme toggling with smooth transitions
  function enhanceDarkModeToggle() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const root = document.documentElement;
    let isDarkMode = true; // Start with dark mode enabled
    
    const darkTheme = {
      '--background-dark': '#111827',
      '--text-light': '#F3F4F6'
    };
    
    const lightTheme = {
      '--background-dark': '#F3F4F6',
      '--text-light': '#111827'
    };
    
    // Apply theme
    function applyTheme(theme) {
      for (const [property, value] of Object.entries(theme)) {
        root.style.setProperty(property, value);
      }
    }
    
    darkModeToggle.addEventListener('click', () => {
      isDarkMode = !isDarkMode;
      
      // Animate the toggle button
      gsap.to(darkModeToggle, {
        rotation: "+=180",
        duration: 0.5,
        ease: "power2.inOut"
      });
      
      // Update icon
      const icon = darkModeToggle.querySelector('i');
      if (isDarkMode) {
        icon.className = 'fas fa-adjust';
        applyTheme(darkTheme);
        document.body.classList.add('dark');
        videoBackground.style.opacity = '0.5';
      } else {
        icon.className = 'fas fa-sun';
        applyTheme(lightTheme);
        document.body.classList.remove('dark');
        videoBackground.style.opacity = '0.2';
      }
      
      // Animate the transition
      gsap.fromTo('body', 
        { backgroundColor: isDarkMode ? lightTheme['--background-dark'] : darkTheme['--background-dark'] },
        { 
          backgroundColor: isDarkMode ? darkTheme['--background-dark'] : lightTheme['--background-dark'],
          duration: 0.5,
          ease: "power2.inOut"
        }
      );
    });
  }
  
  // Skill progress animation
  function initSkillProgressBars() {
    const skills = [
      { name: 'Python', level: 90 },
      { name: 'JavaScript', level: 85 },
      { name: 'TypeScript', level: 75 },
      { name: 'Java', level: 70 },
      { name: 'React', level: 80 },
      { name: 'Node.js', level: 85 },
      { name: 'Django', level: 75 },
      { name: 'Flask', level: 70 }
    ];
    
    // Create skill bars
    const skillContainer = document.querySelector('#skills .grid');
    
    const progressContainer = document.createElement('div');
    progressContainer.className = 'bg-gray-800 p-6 rounded-xl col-span-3';
    progressContainer.innerHTML = `<h3 class="text-2xl font-bold mb-6 text-secondary-500">Proficiency Levels</h3>`;
    
    const barsContainer = document.createElement('div');
    barsContainer.className = 'space-y-4';
    
    skills.forEach(skill => {
      const skillBar = document.createElement('div');
      skillBar.className = 'skill-bar';
      skillBar.innerHTML = `
        <div class="flex justify-between mb-1">
          <span class="font-medium text-white">${skill.name}</span>
          <span class="text-sm text-gray-400">${skill.level}%</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2.5">
          <div class="bg-primary-500 h-2.5 rounded-full" style="width: 0%"></div>
        </div>
      `;
      barsContainer.appendChild(skillBar);
    });
    
    progressContainer.appendChild(barsContainer);
    skillContainer.appendChild(progressContainer);
    
    // Animate skill bars on scroll
    gsap.registerPlugin(ScrollTrigger);
    
    ScrollTrigger.create({
      trigger: progressContainer,
      start: "top 80%",
      onEnter: () => {
        const bars = document.querySelectorAll('.skill-bar .bg-primary-500');
        skills.forEach((skill, index) => {
          gsap.to(bars[index], {
            width: `${skill.level}%`,
            duration: 1.5,
            ease: "power2.out",
            delay: index * 0.1
          });
        });
      },
      onLeaveBack: () => {
        const bars = document.querySelectorAll('.skill-bar .bg-primary-500');
        bars.forEach(bar => {
          gsap.to(bar, {
            width: "0%",
            duration: 1
          });
        });
      }
    });
  }
  
  // Interactive portfolio project cards
  function enhancePortfolioItems() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
      // Create view details button
      const viewButton = document.createElement('button');
      viewButton.className = 'view-details mt-4 bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg transition';
      viewButton.textContent = 'View Details';
      item.appendChild(viewButton);
      
      // Create modal for each project
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 hidden';
      
      const projectTitle = item.querySelector('h3').textContent;
      const projectDesc = item.querySelector('p').textContent;
      const projectImg = item.querySelector('img').getAttribute('src');
      
      modal.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-xl max-w-2xl mx-4 relative">
          <button class="close-modal absolute top-4 right-4 text-gray-400 hover:text-white">
            <i class="fas fa-times text-xl"></i>
          </button>
          <h3 class="text-2xl font-bold mb-4 text-primary-500">${projectTitle}</h3>
          <img src="${projectImg}" alt="${projectTitle}" class="w-full h-64 object-cover rounded-lg mb-4">
          <p class="text-gray-300 mb-4">${projectDesc}</p>
          <div class="mb-4">
            <h4 class="font-bold text-secondary-500 mb-2">Technologies Used:</h4>
            <div class="flex flex-wrap gap-2">
              <span class="bg-gray-700 px-2 py-1 rounded-full text-sm">Python</span>
              <span class="bg-gray-700 px-2 py-1 rounded-full text-sm">React</span>
              <span class="bg-gray-700 px-2 py-1 rounded-full text-sm">TensorFlow</span>
            </div>
          </div>
          <div class="mb-4">
            <h4 class="font-bold text-secondary-500 mb-2">Key Features:</h4>
            <ul class="list-disc pl-5 text-gray-300">
              <li>Responsive design</li>
              <li>Machine learning integration</li>
              <li>Real-time data processing</li>
            </ul>
          </div>
          <a href="#" class="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg transition block text-center">
            Visit Project
          </a>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Handle modal open
      viewButton.addEventListener('click', () => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        gsap.fromTo(modal.querySelector('div'),
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      });
      
      // Handle modal close
      modal.querySelector('.close-modal').addEventListener('click', () => {
        gsap.to(modal.querySelector('div'), {
          scale: 0.8,
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
          }
        });
      });
      
      // Close modal on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          gsap.to(modal.querySelector('div'), {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              modal.classList.add('hidden');
              document.body.style.overflow = 'auto';
            }
          });
        }
      });
    });
  }
  
  // Interactive resume preview modal
  function enhanceResumeDownload() {
    const resumeButton = document.querySelector('[download="Logeswarar_G_Resume.png"]');
    
    // Create preview button
    const previewButton = document.createElement('button');
    previewButton.className = 'w-full bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition flex items-center justify-center mb-4';
    previewButton.innerHTML = '<i class="fas fa-eye mr-3"></i> Preview Resume';
    
    resumeButton.parentNode.insertBefore(previewButton, resumeButton);
    
    // Create modal for resume preview
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50 hidden';
    
    modal.innerHTML = `
      <div class="bg-gray-800 p-6 rounded-xl max-w-4xl mx-4 relative h-5/6 flex flex-col">
        <button class="close-modal absolute top-4 right-4 text-gray-400 hover:text-white">
          <i class="fas fa-times text-xl"></i>
        </button>
        <h3 class="text-2xl font-bold mb-4 text-primary-500">Resume Preview</h3>
        <div class="flex-grow overflow-auto">
          <img src="resume.png" alt="Resume" class="w-full h-auto">
        </div>
        <div class="mt-4 flex justify-end">
          <a 
            href="resume.png" 
            download="Logeswarar_G_Resume.png" 
            class="bg-secondary-500 hover:bg-secondary-600 px-6 py-2 rounded-lg transition flex items-center"
          >
            <i class="fas fa-download mr-2"></i> Download
          </a>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle modal open
    previewButton.addEventListener('click', () => {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      
      gsap.fromTo(modal.querySelector('div'),
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    });
    
    // Handle modal close
    modal.querySelector('.close-modal').addEventListener('click', () => {
      gsap.to(modal.querySelector('div'), {
        y: 100,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          modal.classList.add('hidden');
          document.body.style.overflow = 'auto';
        }
      });
    });
    
    // Close modal on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        gsap.to(modal.querySelector('div'), {
          y: 100,
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
          }
        });
      }
    });
  }
  
  // Initialize all enhancements when the page loads
  document.addEventListener('DOMContentLoaded', function() {
    // Load GSAP ScrollTo plugin dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollToPlugin.min.js';
    document.head.appendChild(script);
    
    script.onload = () => {
      // Initialize all enhancements
      initScrollAnimations();
      enhanceThreeBackground();
      initImageOptimization();
      enhanceNavigation();
      enhanceContactForm();
      enhanceDarkModeToggle();
      initSkillProgressBars();
      enhancePortfolioItems();
      enhanceResumeDownload();
    };
  });