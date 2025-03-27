// 3D Animated Background
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Resize canvas when window is resized
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Particle settings
    const particleCount = 100;
    const particles = [];
    const connectionDistance = 150;
    const nodeSize = 2;
    
    // Colors
    const nodeColor = '#3498db';
    const lineColor = 'rgba(52, 152, 219, 0.3)';
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * nodeSize + 1,
            color: nodeColor
        });
    }
    
    // Animation function
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Move particles
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // Connect particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        
        // Add pulse effect to simulate circuit activity
        const time = Date.now() * 0.001;
        const pulseCount = 3;
        
        for (let i = 0; i < pulseCount; i++) {
            const pulseX = canvas.width * (0.3 + 0.4 * Math.sin(time * 0.5 + i * Math.PI / pulseCount));
            const pulseY = canvas.height * (0.3 + 0.4 * Math.cos(time * 0.7 + i * Math.PI / pulseCount));
            const pulseSize = 50 + 30 * Math.sin(time * 2 + i);
            
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, pulseSize, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, pulseSize);
            gradient.addColorStop(0, 'rgba(52, 152, 219, 0.3)');
            gradient.addColorStop(1, 'rgba(52, 152, 219, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
}); 
       
