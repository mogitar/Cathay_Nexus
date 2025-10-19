// travel-checklist.js - Updated with interactive map functionality while preserving existing features

document.addEventListener('DOMContentLoaded', function() {
    // City map configurations
    const cityMaps = {
        hongkong: {
            iframe: '<iframe width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d472322.0488005746!2d113.80906757807455!3d22.3530244703201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3403e2eda332980f%3A0xf08ab3badbeac97c!2z6aaZ5riv!5e0!3m2!1szh-TW!2shk!4v1759915730666!5m2!1szh-TW!2shk"></iframe>',
            name: 'Hong Kong'
        },
        newyork: {
            iframe: '<iframe width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193596.2614483995!2d-74.14465576676365!3d40.69728414614369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2z576O5ZyL57SQ57SE!5e0!3m2!1szh-TW!2shk!4v1759915762585!5m2!1szh-TW!2shk"></iframe>',
            name: 'New York'
        }
    };

    // DOM Elements for interactive map
    const cityButtons = document.querySelectorAll('.city-btn');
    const mapContainer = document.getElementById('city-map');
    const destinationCards = document.querySelectorAll('.destination-card[data-city]');

    // Initialize with Hong Kong map
    let currentCity = 'hongkong';

    // Function to switch city map
    function switchCityMap(city) {
        if (cityMaps[city]) {
            mapContainer.innerHTML = cityMaps[city].iframe;
            currentCity = city;
            
            // Update active button state
            cityButtons.forEach(btn => {
                if (btn.getAttribute('data-city') === city) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Show notification
            showMapNotification(`Showing map of ${cityMaps[city].name}`);
        }
    }

    // City button event listeners
    cityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const city = this.getAttribute('data-city');
            switchCityMap(city);
        });
    });

    // Destination card click event - switch to corresponding city map if it has data-city attribute
    destinationCards.forEach(card => {
        card.addEventListener('click', function() {
            const city = this.getAttribute('data-city');
            if (city && cityMaps[city]) {
                switchCityMap(city);
                
                // Scroll to interactive map section
                document.querySelector('.interactive-map-section').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Function to show notification
    function showMapNotification(message) {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.map-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'map-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #005D63;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            font-weight: 600;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // --- ORIGINAL FUNCTIONALITY (preserved) ---
    
    // Filter functionality for destinations
    const filterButtons = document.querySelectorAll('.filter-btn');
    const allDestinationCards = document.querySelectorAll('.destination-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            allDestinationCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'flex';
                } else if (filter === 'visited') {
                    if (card.classList.contains('visited')) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                } else if (filter === 'not-visited') {
                    if (card.classList.contains('not-visited')) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
    
    // Add new destination functionality
    const addDestinationBtn = document.createElement('button');
    addDestinationBtn.textContent = '+ Add Destination';
    addDestinationBtn.className = 'add-destination-btn';
    addDestinationBtn.style.cssText = `
        background: #005D63;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        margin: 20px auto;
        display: block;
        transition: background 0.3s;
    `;
    
    addDestinationBtn.addEventListener('mouseenter', function() {
        this.style.background = '#004a4f';
    });
    
    addDestinationBtn.addEventListener('mouseleave', function() {
        this.style.background = '#005D63';
    });
    
    addDestinationBtn.addEventListener('click', function() {
        const city = prompt('Enter city name:');
        if (city) {
            addNewDestination(city);
        }
    });
    
    document.querySelector('.destinations-list').appendChild(addDestinationBtn);
    
    function addNewDestination(cityName) {
        const destinationsContainer = document.querySelector('.destinations-container');
        
        const newDestination = document.createElement('div');
        newDestination.className = 'destination-card not-visited';
        newDestination.innerHTML = `
            <div class="destination-info">
                <h4>${cityName}</h4>
                <p>Added: ${new Date().toLocaleDateString()}</p>
                <div class="tags">
                    <span class="tag">New</span>
                </div>
            </div>
            <div class="destination-status">
                <span class="status not-visited">○ Plan to Visit</span>
            </div>
        `;
        
        destinationsContainer.appendChild(newDestination);
        
        // Add click event to toggle visited status
        newDestination.addEventListener('click', function() {
            if (this.classList.contains('visited')) {
                this.classList.remove('visited');
                this.classList.add('not-visited');
                this.querySelector('.status').textContent = '○ Plan to Visit';
                this.querySelector('.status').className = 'status not-visited';
            } else {
                this.classList.remove('not-visited');
                this.classList.add('visited');
                this.querySelector('.status').textContent = '✓ Visited';
                this.querySelector('.status').className = 'status visited';
                
                // Update last visited date
                const dateInfo = this.querySelector('p');
                dateInfo.textContent = `Last visited: ${new Date().toLocaleDateString()}`;
            }
            
            updateStats();
        });
        
        updateStats();
    }
    
    // Add click event to existing destination cards to toggle visited status
    allDestinationCards.forEach(card => {
        // Skip if it's one of the map-linked cards (they already have click handlers)
        if (!card.hasAttribute('data-city')) {
            card.addEventListener('click', function() {
                if (this.classList.contains('visited')) {
                    this.classList.remove('visited');
                    this.classList.add('not-visited');
                    this.querySelector('.status').textContent = '○ Plan to Visit';
                    this.querySelector('.status').className = 'status not-visited';
                } else {
                    this.classList.remove('not-visited');
                    this.classList.add('visited');
                    this.querySelector('.status').textContent = '✓ Visited';
                    this.querySelector('.status').className = 'status visited';
                    
                    // Update last visited date
                    const dateInfo = this.querySelector('p');
                    dateInfo.textContent = `Last visited: ${new Date().toLocaleDateString()}`;
                }
                
                updateStats();
            });
        }
    });
    
    // Update statistics
    function updateStats() {
        const visitedCount = document.querySelectorAll('.destination-card.visited').length;
        const notVisitedCount = document.querySelectorAll('.destination-card.not-visited').length;
        const totalCount = visitedCount + notVisitedCount;
        
        // Update stats display if elements exist
        const citiesElement = document.querySelector('.stat-card:nth-child(2) .stat-number');
        if (citiesElement) {
            citiesElement.textContent = visitedCount;
        }
    }
    
    // Initialize stats
    updateStats();
    
    // Add search functionality
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search destinations...';
    searchInput.className = 'destination-search';
    searchInput.style.cssText = `
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 16px;
    `;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        allDestinationCards.forEach(card => {
            const cityName = card.querySelector('h4').textContent.toLowerCase();
            if (cityName.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
    
    document.querySelector('.destinations-list').insertBefore(searchInput, document.querySelector('.filter-buttons'));

    // Keyboard navigation for maps
    document.addEventListener('keydown', function(e) {
        if (e.key === '1' || e.key === 'h') {
            switchCityMap('hongkong');
        } else if (e.key === '2' || e.key === 'n') {
            switchCityMap('newyork');
        }
    });

    // Initialize the page
    console.log('Travel Map page initialized with interactive maps');
    console.log('Keyboard shortcuts: 1/H for Hong Kong, 2/N for New York');
});