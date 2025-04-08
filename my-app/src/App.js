import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import Typed from 'typed.js';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

// Import FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGithub, faLinkedin, faTwitter, faPython, faAws, 
  faReact, faNode, faJs, faJava, faDocker 
} from '@fortawesome/free-brands-svg-icons';
import { 
  faCode, faBrain, faDatabase, faCloud, faTrophy, 
  faCertificate, faAdjust, faHeart, faFileImage 
} from '@fortawesome/free-solid-svg-icons';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Component for the animated background
const AnimatedBackground = () => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    let scene, camera, renderer, particles;
    let animationFrameId;

    const init = () => {
      // Create scene
      scene = new THREE.Scene();
      
      // Create camera
      camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
      );
      camera.position.z = 5;
      
      // Create renderer
      renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      mountRef.current.appendChild(renderer.domElement);
      
      // Create particles
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      
      for (let i = 0; i < 1500; i++) {
        vertices.push(
          Math.random() * 30 - 15,
          Math.random() * 30 - 15,
          Math.random() * 30 - 15
        );
      }
      
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      
      const material = new THREE.PointsMaterial({
        color: 0x3B82F6,
        size: 0.08,
        transparent: true,
        opacity: 0.7
      });
      
      particles = new THREE.Points(geometry, material);
      scene.add(particles);
    };
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.0005;
      }
      
      renderer.render(scene, camera);
    };
    
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    
    init();
    animate();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full z-0" />;
};

// Component for the video background
const VideoBackground = () => {
  const videoRef = useRef(null);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && videoRef.current) {
        videoRef.current.pause();
      } else if (videoRef.current) {
        videoRef.current.play();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  return (
    <video 
      ref={videoRef}
      className="fixed top-0 left-0 w-full h-full object-cover z-0 opacity-50"
      autoPlay
      loop
      muted
      playsInline
    >
      <source src="back.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

// Component for the navigation bar
const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-gray-900 bg-opacity-95 shadow-lg' : 'bg-gray-900 bg-opacity-70'
    } backdrop-blur-md`}>
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-2xl font-bold">
          <span className="text-white">Logeswarar</span> <span className="text-blue-500">G</span>
        </div>
        
        <div className="space-x-6 hidden md:block">
          {['home', 'about', 'projects', 'skills', 'achievements', 'contact'].map((item) => (
            <a 
              key={item}
              href={`#${item}`} 
              className="nav-link text-gray-300 hover:text-blue-500 transition-colors duration-300"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </a>
          ))}
        </div>
        
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-700 hover:bg-blue-500 transition-colors duration-300"
          aria-label="Toggle Dark Mode"
        >
          <FontAwesomeIcon icon={faAdjust} className="text-white" />
        </button>
      </div>
    </nav>
  );
};

// Component for the hero section
const Hero = () => {
  const typedRef = useRef(null);
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });
  
  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        'Software Engineer', 
        'AI/ML Specialist', 
        'Full Stack Developer',
        'Tech Innovator'
      ],
      typeSpeed: 50,
      backSpeed: 50,
      loop: true,
      smartBackspace: true
    });
    
    return () => {
      typed.destroy();
    };
  }, []);
  
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative">
      <motion.div 
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto text-center"
      >
        <div className="bg-gray-800 bg-opacity-80 p-10 rounded-xl inline-block shadow-2xl backdrop-blur-sm">
          <img 
            src="vip.jpg" 
            alt="Profile" 
            className="mx-auto rounded-full w-64 h-64 mb-6 border-4 border-blue-500 object-cover 
                      hover:scale-105 transition-transform duration-300"
          />
          <h1 className="text-5xl font-bold mb-4 text-white">Logeswarar G</h1>

          <h2 className="text-2xl mb-6 text-gray-300">
            <span ref={typedRef}></span>
          </h2>
          
          <div className="flex justify-center space-x-6">
            {[
              { icon: faGithub, url: 'https://github.com/logeswarar' },
              { icon: faLinkedin, url: 'https://linkedin.com/in/logeswarar' },
              { icon: faTwitter, url: 'https://twitter.com/logeswarar' }
            ].map((social, index) => (
              <motion.a 
                key={index}
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-4xl text-gray-300 hover:text-blue-500 transition-colors duration-300"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <FontAwesomeIcon icon={social.icon} />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// Component for the about section
const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });
  
  const skills = [
    { icon: faCode, title: 'Web Development', description: 'Modern, Responsive Designs', color: 'text-blue-500' },
    { icon: faBrain, title: 'Machine Learning', description: 'AI-Driven Solutions', color: 'text-green-500' },
    { icon: faDatabase, title: 'Data Engineering', description: 'Scalable Architectures', color: 'text-green-500' },
    { icon: faCloud, title: 'Cloud Computing', description: 'DevOps & Deployment', color: 'text-blue-500' }
  ];
  
  return (
    <section id="about" className="min-h-screen py-24 flex items-center justify-center relative">
      <motion.div 
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto grid md:grid-cols-2 gap-10 items-center"
      >
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gray-800 p-8 rounded-xl shadow-lg backdrop-blur-sm"
        >
          <h2 className="text-4xl font-bold mb-6 text-blue-500">About Me</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            I'm a passionate software engineer specializing in full-stack development and AI/ML solutions. 
            With a strong background in computer science and a keen interest in emerging technologies, 
            I transform complex problems into elegant, efficient solutions. With a commitment to continuous learning,
            I stay at the forefront of technological advancements to deliver exceptional results.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-6">
          {skills.map((skill, index) => (
            <motion.div 
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-gray-800 p-6 rounded-xl text-center shadow-lg backdrop-blur-sm
                        hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-300"
            >
              <FontAwesomeIcon icon={skill.icon} className={`text-5xl ${skill.color} mb-4`} />
              <h3 className="text-xl font-bold text-white">{skill.title}</h3>
              <p className="text-gray-400">{skill.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// Component for the projects section
const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  
  const projects = [
    {
      image: "OIP.jpg",
      title: "Automated Attendance System",
      description: "An automated class attendance system leveraging advanced recognition technologies to streamline tracking and managing student attendance."
    },
    {
      image: "OIPP.jpg",
      title: "Smart Agriculture System",
      description: "Developed a machine learning project to assist farmers with predictive analytics for crop yield, pest detection, and optimal resource allocation."
    },
    {
      image: "OIPO.jpg",
      title: "Hospital Appointment System",
      description: "Designed an automatic hospital appointment system to improve patient scheduling, reduce wait times, and enhance healthcare efficiency."
    }
  ];
  
  return (
    <section id="projects" className="py-24 relative">
      <motion.div 
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto"
      >
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-500">My Projects</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg
                        hover:-translate-y-2 hover:shadow-blue-500/20 transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-blue-500">{project.title}</h3>
                <p className="text-gray-400">{project.description}</p>
                
                <div className="mt-4 flex justify-between">
                  <a 
                    href="#" 
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center"
                  >
                    <span>View Project</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-gray-300 transition-colors duration-300"
                  >
                    <FontAwesomeIcon icon={faGithub} className="text-xl" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// Component for the skills section
const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  
  const skillCategories = [
    {
      title: "Programming",
      skills: ["Python", "JavaScript", "TypeScript", "Java", "C++", "SQL"]
    },
    {
      title: "Frameworks",
      skills: ["React", "Node.js", "Django", "Flask", "Express", "Next.js"]
    },
    {
      title: "Tools & Technologies",
      skills: ["Docker", "Kubernetes", "AWS", "Git", "MongoDB", "PostgreSQL"]
    }
  ];
  
  return (
    <section id="skills" className="py-24 relative">
      <motion.div 
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto"
      >
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-500">Technical Skills</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div 
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-gray-800 p-6 rounded-xl shadow-lg backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold mb-6 text-green-500">{category.title}</h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span 
                    key={skillIndex}
                    whileHover={{ scale: 1.1, backgroundColor: '#3B82F6' }}
                    className="bg-gray-700 px-3 py-1 rounded-full cursor-pointer
                              transition-all duration-300"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// Component for the achievements section
const Achievements = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  
  const achievements = [
    {
      icon: faTrophy,
      title: "Best Innovator Award",
      description: "Winner of University Startup Challenge 2023",
      color: "text-yellow-500"
    },
    {
      icon: faCertificate,
      title: "Machine Learning Expert",
      description: "Advanced ML Certification from Stanford Online",
      color: "text-green-500"
    },
    {
      icon: faCode,
      title: "Open Source Contributor",
      description: "Top Contributor in Multiple GitHub Projects",
      color: "text-blue-500"
    }
  ];
  
  const certifications = [
    { icon: faPython, title: "Python Certified" },
    { icon: faAws, title: "AWS Solutions Architect" },
    { icon: faDatabase, title: "Data Science Professional" }
  ];
  
  return (
    <section id="achievements" className="py-24 bg-gray-900 bg-opacity-80 relative">
      <motion.div 
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto"
      >
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-500">Achievements & Certifications</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <motion.div 
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="p-6 rounded-xl text-center bg-gray-800 bg-opacity-70 backdrop-blur-sm shadow-lg
                        hover:-translate-y-2 transition-all duration-300"
            >
              <FontAwesomeIcon icon={achievement.icon} className={`text-5xl ${achievement.color} mb-4`} />
              <h3 className="text-xl font-bold mb-2 text-white">{achievement.title}</h3>
              <p className="text-gray-400">{achievement.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {certifications.map((cert, index) => (
            <motion.div 
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="px-6 py-3 rounded-full flex items-center bg-blue-500 bg-opacity-20 border-2 border-blue-500"
            >
              <FontAwesomeIcon icon={cert.icon} className="mr-2" />
              {cert.title}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// Component for the contact section
const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    message: '',
    isError: false,
    isVisible: false
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setFormStatus({
        message: 'Message sent successfully!',
        isError: false,
        isVisible: true
      });
      
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      
      // Hide the status message after 5 seconds
      setTimeout(() => {
        setFormStatus(prev => ({ ...prev, isVisible: false }));
      }, 5000);
    }, 1000);
  };
  
  return (
    <section id="contact" className="py-24 relative">
      <motion.div 
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto grid md:grid-cols-2 gap-10 max-w-4xl"
      >
        {/* Contact Form Column */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gray-800 p-10 rounded-xl shadow-lg backdrop-blur-sm"
        >
          <h2 className="text-4xl font-bold text-center mb-8 text-blue-500">Get In Touch</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input 
                type="text" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name" 
                required 
                className="w-full p-4 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
            
            <div>
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email" 
                required 
                className="w-full p-4 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
            
            <div>
              <textarea 
                name="message" 
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message" 
                required 
                className="w-full p-4 bg-gray-700 rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              ></textarea>
            </div>
            
            <motion.button 
              type="submit" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-blue-500 hover:bg-blue-600 p-4 rounded-lg transition-colors duration-300 font-bold"
            >
              Send Message
            </motion.button>
          </form>
          
          {formStatus.isVisible && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mt-4 text-center p-3 rounded ${formStatus.isError ? 'bg-red-500 bg-opacity-20 text-red-300' : 'bg-green-500 bg-opacity-20 text-green-300'}`}
            >
              {formStatus.message}
            </motion.div>
          )}
        </motion.div>
  
        {/* Resume Download Column */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gray-800 p-10 rounded-xl flex flex-col items-center justify-center text-center shadow-lg backdrop-blur-sm"
        >
          <h2 className="text-4xl font-bold mb-6 text-blue-500">Download Resume</h2>
          <p className="text-gray-400 mb-6">
            Get a comprehensive overview of my professional experience and skills.
          </p>
          <div className="flex flex-col space-y-4 w-full">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="resume.png" 
              download="Logeswarar_G_Resume.png" 
              className="w-full bg-green-500 hover:bg-green-600 p-4 rounded-lg transition-colors duration-300 flex items-center justify-center font-bold"
            >
              <FontAwesomeIcon icon={faFileImage} className="mr-3" /> Download Resume (PNG)
            </motion.a>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            Last Updated: March 2024
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Component for the footer
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-center py-6">
      <div className="container mx-auto">
        <p className="text-gray-400 mb-2">
          &copy; {new Date().getFullYear()} Logeswarar G. All Rights Reserved.
        </p>
        <p className="text-sm text-gray-500">
          Designed and Developed with <FontAwesomeIcon icon={faHeart} className="text-red-500" /> by Logeswarar G
        </p>
      </div>
    </footer>
  );
};

// Main App component
const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen transition-colors duration-300`}>
      {/* Background Elements */}
      <VideoBackground />
      <AnimatedBackground />
      
      {/* Main Content */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Achievements />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;