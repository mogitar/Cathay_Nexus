// onboard-services.js - Updated with meal preference functionality

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show the corresponding tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Meal Preference Functionality
    const mealPreferenceRadios = document.querySelectorAll('input[name="meal-preference"]');
    const mealSelectionSection = document.getElementById('meal-selection-section');
    
    // Initialize based on default selection
    updateMealSelectionVisibility();
    
    // Add event listeners to radio buttons
    mealPreferenceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateMealSelectionVisibility();
            saveMealPreference(this.value);
            showPreferenceConfirmation(this.value);
        });
    });
    
    function updateMealSelectionVisibility() {
        const selectedPreference = document.querySelector('input[name="meal-preference"]:checked').value;
        
        if (selectedPreference === 'yes') {
            mealSelectionSection.classList.remove('hidden');
        } else {
            mealSelectionSection.classList.add('hidden');
            // Clear any selected meals when hiding the section
            clearSelectedMeals();
        }
    }
    
    function saveMealPreference(preference) {
        // Save to localStorage for persistence
        localStorage.setItem('cathayMealPreference', preference);
        
        // In a real app, you would send this to your backend
        console.log(`Meal preference saved: ${preference}`);
    }
    
    function clearSelectedMeals() {
        // Clear any selected meal buttons
        const selectedButtons = document.querySelectorAll('.select-btn.selected');
        selectedButtons.forEach(button => {
            button.classList.remove('selected');
            button.textContent = 'Select';
        });
        
        // Remove any meal orders from current orders
        const mealOrders = document.querySelectorAll('.order-item');
        mealOrders.forEach(order => {
            if (order.querySelector('h5').textContent.includes('Meal')) {
                order.remove();
            }
        });
    }
    
    function showPreferenceConfirmation(preference) {
        const message = preference === 'yes' 
            ? 'Great! You can now pre-order your meal.' 
            : 'Noted. No meal will be served. You can still order beverages.';
        
        showConfirmation(message);
    }
    
    // Load saved preference on page load
    function loadSavedPreference() {
        const savedPreference = localStorage.getItem('cathayMealPreference');
        if (savedPreference) {
            const radioToSelect = document.querySelector(`input[name="meal-preference"][value="${savedPreference}"]`);
            if (radioToSelect) {
                radioToSelect.checked = true;
                updateMealSelectionVisibility();
            }
        }
    }
    
    // Enhanced meal selection functionality
    const mealSelectButtons = document.querySelectorAll('.select-btn');
    mealSelectButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Only allow selection if meal preference is "yes"
            const mealPreference = document.querySelector('input[name="meal-preference"]:checked').value;
            
            if (mealPreference !== 'yes') {
                showConfirmation('Please select "Yes" for meal preference first.');
                return;
            }
            
            const mealOption = this.closest('.meal-option');
            const mealName = mealOption.querySelector('h4').textContent;
            const mealDescription = mealOption.querySelector('p').textContent;
            
            // Toggle selection state
            const isCurrentlySelected = this.classList.contains('selected');
            
            // Clear other selections (only one meal can be selected)
            mealSelectButtons.forEach(btn => {
                btn.classList.remove('selected');
                btn.textContent = 'Select';
            });
            
            if (!isCurrentlySelected) {
                this.classList.add('selected');
                this.textContent = 'Selected ✓';
                addOrder(mealName, 'meal', mealDescription);
                showConfirmation(`${mealName} has been selected!`);
            } else {
                // If deselecting, remove from orders
                removeMealOrder(mealName);
            }
        });
    });
    
    function removeMealOrder(mealName) {
        const orders = document.querySelectorAll('.order-item');
        orders.forEach(order => {
            const orderTitle = order.querySelector('h5').textContent;
            if (orderTitle === mealName) {
                order.remove();
            }
        });
        updateNoOrdersDisplay();
    }
    
    // Order management (existing functionality with enhancements)
    let orders = JSON.parse(localStorage.getItem('cathayOrders')) || [];
    const ordersList = document.querySelector('.orders-list');
    const noOrders = document.querySelector('.no-orders');
    
    // Function to update orders display
    function updateOrdersDisplay() {
        ordersList.innerHTML = '';
        
        if (orders.length === 0) {
            noOrders.style.display = 'block';
        } else {
            noOrders.style.display = 'none';
            
            orders.forEach((order, index) => {
                const orderItem = document.createElement('div');
                orderItem.className = 'order-item';
                orderItem.innerHTML = `
                    <div class="order-details">
                        <h5>${order.name}</h5>
                        <p>Ordered: ${order.time}</p>
                        ${order.notes ? `<p class="order-notes">${order.notes}</p>` : ''}
                    </div>
                    <div class="order-status ${order.status}">${order.status}</div>
                    <button class="cancel-order" data-index="${index}">Cancel</button>
                `;
                
                ordersList.appendChild(orderItem);
            });
            
            // Add event listeners to cancel buttons
            document.querySelectorAll('.cancel-order').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    cancelOrder(index);
                });
            });
        }
        
        // Save to localStorage
        localStorage.setItem('cathayOrders', JSON.stringify(orders));
    }
    
    // Function to add a new order
    function addOrder(name, category, notes = '') {
        const now = new Date();
        const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
        
        const newOrder = {
            name: name,
            category: category,
            time: timeString,
            status: 'preparing',
            notes: notes
        };
        
        orders.push(newOrder);
        updateOrdersDisplay();
        
        // Simulate order progression
        setTimeout(() => {
            newOrder.status = 'on-the-way';
            updateOrdersDisplay();
        }, 30000); // 30 seconds
        
        setTimeout(() => {
            newOrder.status = 'delivered';
            updateOrdersDisplay();
        }, 60000); // 60 seconds
    }
    
    // Function to cancel an order
    function cancelOrder(index) {
        if (orders[index].status === 'preparing') {
            // If canceling a meal, also reset the select button
            if (orders[index].category === 'meal') {
                const mealSelectButtons = document.querySelectorAll('.select-btn');
                mealSelectButtons.forEach(button => {
                    if (button.textContent === 'Selected ✓') {
                        button.classList.remove('selected');
                        button.textContent = 'Select';
                    }
                });
            }
            
            orders.splice(index, 1);
            updateOrdersDisplay();
        } else {
            alert('Sorry, your order is already being prepared and cannot be cancelled.');
        }
    }
    
    function updateNoOrdersDisplay() {
        const orderItems = document.querySelectorAll('.order-item');
        if (orderItems.length === 0) {
            noOrders.style.display = 'block';
        } else {
            noOrders.style.display = 'none';
        }
    }
    
    // Beverage order functionality
    const beverageOrderButtons = document.querySelectorAll('.order-btn');
    beverageOrderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const beverageItem = this.closest('.beverage-item');
            const beverageName = beverageItem.querySelector('.beverage-name').textContent;
            
            addOrder(beverageName, 'beverage');
            
            // Show confirmation
            showConfirmation(`${beverageName} has been added to your orders!`);
        });
    });
    
    // Comfort item request functionality
    const requestButtons = document.querySelectorAll('.request-btn');
    requestButtons.forEach(button => {
        button.addEventListener('click', function() {
            const comfortItem = this.closest('.comfort-item');
            const itemName = comfortItem.querySelector('h4').textContent;
            
            addOrder(itemName, 'comfort');
            
            // Show confirmation
            showConfirmation(`Your request for ${itemName} has been submitted!`);
        });
    });
    
    // WiFi connection functionality
    const connectButton = document.querySelector('.connect-btn');
    if (connectButton) {
        connectButton.addEventListener('click', function() {
            // Simulate WiFi connection process
            connectButton.textContent = 'Connecting...';
            connectButton.disabled = true;
            
            setTimeout(() => {
                connectButton.textContent = 'Connected';
                connectButton.style.background = '#27ae60';
                
                showConfirmation('You are now connected to Cathay Pacific WiFi!');
            }, 3000);
        });
    }
    
    // Entertainment browse functionality
    const browseButtons = document.querySelectorAll('.browse-btn');
    browseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const entItem = this.closest('.ent-item');
            const category = entItem.querySelector('h5').textContent;
            
            showConfirmation(`Opening ${category} selection...`);
        });
    });
    
    // Function to show confirmation message
    function showConfirmation(message) {
        // Create confirmation element
        const confirmation = document.createElement('div');
        confirmation.className = 'confirmation-message';
        confirmation.textContent = message;
        confirmation.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #005D63;
            color: white;
            padding: 20px 30px;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            font-weight: 600;
            text-align: center;
            max-width: 300px;
        `;
        
        document.body.appendChild(confirmation);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (document.body.contains(confirmation)) {
                document.body.removeChild(confirmation);
            }
        }, 3000);
    }
    
    // Special meal request form
    const specialMealBtn = document.createElement('button');
    specialMealBtn.textContent = 'Request Special Meal';
    specialMealBtn.className = 'special-meal-btn';
    specialMealBtn.style.cssText = `
        background: #005D63;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        margin: 15px 0;
        display: block;
    `;
    
    specialMealBtn.addEventListener('click', function() {
        // Check if meal preference is set to yes
        const mealPreference = document.querySelector('input[name="meal-preference"]:checked').value;
        if (mealPreference !== 'yes') {
            showConfirmation('Please select "Yes" for meal preference first.');
            return;
        }
        
        const mealType = prompt('Please specify your special meal requirement (e.g., gluten-free, kosher, vegan):');
        if (mealType) {
            addOrder(`Special Meal: ${mealType}`, 'meal', 'Special dietary requirement');
            showConfirmation(`Your special meal (${mealType}) request has been submitted!`);
        }
    });
    
    // Add the special meal button to the dining section
    const diningSection = document.getElementById('dining');
    if (diningSection) {
        const mealSelectionDiv = diningSection.querySelector('.meal-selection');
        if (mealSelectionDiv) {
            mealSelectionDiv.appendChild(specialMealBtn);
        }
    }
    
    // Initialize orders display
    updateOrdersDisplay();
    
    // Load saved meal preference
    loadSavedPreference();
    
    // Add clear all orders button
    const clearOrdersBtn = document.createElement('button');
    clearOrdersBtn.textContent = 'Clear All Orders';
    clearOrdersBtn.className = 'clear-orders-btn';
    clearOrdersBtn.style.cssText = `
        background: #e74c3c;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        margin-top: 15px;
    `;
    
    clearOrdersBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all orders?')) {
            orders = [];
            updateOrdersDisplay();
            
            // Also reset meal selection buttons
            mealSelectButtons.forEach(button => {
                button.classList.remove('selected');
                button.textContent = 'Select';
            });
            
            showConfirmation('All orders have been cleared!');
        }
    });
    
    document.querySelector('.current-orders').appendChild(clearOrdersBtn);
});
