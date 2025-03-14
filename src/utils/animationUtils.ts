
export const createFishEffect = (type: 'increment' | 'decrement') => {
  // Create fish element
  const fish = document.createElement('div');
  
  // Set fish style and animation properties
  fish.innerHTML = type === 'increment' ? '🐠' : '🎱';
  fish.style.position = 'fixed';
  fish.style.fontSize = '2rem';
  fish.style.zIndex = '9999';
  fish.style.userSelect = 'none';
  fish.style.pointerEvents = 'none';
  
  // Generate random position near the click
  const x = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
  const y = Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1;
  
  fish.style.left = `${x}px`;
  fish.style.top = `${y}px`;
  
  // Create swim animation
  fish.animate(
    [
      { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
      { 
        transform: `translate(${Math.random() * 100 - 50}px, -${Math.random() * 100 + 50}px) rotate(${Math.random() * 30 - 15}deg) scale(0)`, 
        opacity: 0 
      }
    ],
    {
      duration: 1000,
      easing: 'ease-out',
      fill: 'forwards'
    }
  );
  
  // Add to DOM and remove after animation
  document.body.appendChild(fish);
  setTimeout(() => {
    document.body.removeChild(fish);
  }, 1000);
};
