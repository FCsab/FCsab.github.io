const snowContainer = document.getElementById("snow-container");

        function createSnowflake() {
            const snowflake = document.createElement("div");
            snowflake.classList.add("snowflake");
            
            // Randomize size and position
            const size = Math.random() * 5 + 2; // Size between 2px and 7px
            snowflake.style.width = `${size}px`;
            snowflake.style.height = `${size}px`;
            
            // Random horizontal position
            snowflake.style.left = `${Math.random() * 100}vw`;
            
            // Add fall animation
            snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`; // Duration between 2s and 5s
            snowflake.style.animationName = 'fall';
            
            // Append to container
            snowContainer.appendChild(snowflake);
            
            // Remove snowflake after animation ends
            snowflake.addEventListener('animationend', () => {
                snowflake.remove();
            });
        }

        // Create snowflakes at intervals
        setInterval(createSnowflake, 25);