// airport-info.js

document.addEventListener('DOMContentLoaded', function() {
    // Gate information modal
    const gates = document.querySelectorAll('.gate');
    
    gates.forEach(gate => {
        gate.addEventListener('click', function() {
            const gateNumber = this.textContent;
            showGateInfo(gateNumber);
        });
    });
    
    function showGateInfo(gateNumber) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        `;
        
        modalContent.innerHTML = `
            <h3>Gate ${gateNumber} Information</h3>
            <div class="gate-details">
                <div class="detail-item">
                    <span class="label">Gate Status:</span>
                    <span class="value ${gateNumber === 'B25' ? 'on-time' : 'available'}">${gateNumber === 'B25' ? 'Your Gate - Boarding at 17:15' : 'Available'}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Flight:</span>
                    <span class="value">${gateNumber === 'B25' ? 'CX 880 to HKG' : 'Various'}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Facilities Nearby:</span>
                    <span class="value">Restrooms, Charging Stations, Water Fountain</span>
                </div>
                <div class="detail-item">
                    <span class="label">Walking Time from Check-in:</span>
                    <span class="value">${gateNumber === 'B25' ? '8 minutes' : '5-10 minutes'}</span>
                </div>
            </div>
            <button class="close-modal" style="
                background: #005D63;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                margin-top: 20px;
                font-weight: 600;
            ">Close</button>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modalContent.querySelector('.close-modal');
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // Facility search functionality
    const facilitySearch = document.createElement('input');
    facilitySearch.type = 'text';
    facilitySearch.placeholder = 'Search facilities...';
    facilitySearch.className = 'facility-search';
    facilitySearch.style.cssText = `
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 16px;
    `;
    
    facilitySearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const facilityItems = document.querySelectorAll('.facility-item');
        
        facilityItems.forEach(item => {
            const facilityName = item.querySelector('h5').textContent.toLowerCase();
            const facilityType = item.querySelector('p').textContent.toLowerCase();
            
            if (facilityName.includes(searchTerm) || facilityType.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Also hide/show categories based on results
        const categories = document.querySelectorAll('.facility-category');
        categories.forEach(category => {
            const visibleItems = category.querySelectorAll('.facility-item[style=""]').length + 
                               category.querySelectorAll('.facility-item:not([style])').length;
            
            if (visibleItems === 0) {
                category.style.display = 'none';
            } else {
                category.style.display = 'block';
            }
        });
    });
    
    document.querySelector('.facilities-section').insertBefore(facilitySearch, document.querySelector('.facilities-section h3').nextSibling);
    
    // Flight status update simulation
    function updateFlightStatus() {
        const statusElement = document.querySelector('.value.on-time');
        if (statusElement) {
            // Randomly change status for demonstration
            const statuses = ['On Time', 'On Time', 'On Time', 'Delayed 15 min', 'Boarding'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            statusElement.textContent = randomStatus;
            
            if (randomStatus === 'Delayed 15 min') {
                statusElement.style.color = '#e67e22';
            } else if (randomStatus === 'Boarding') {
                statusElement.style.color = '#27ae60';
            } else {
                statusElement.style.color = '#27ae60';
            }
        }
    }
    
    // Update flight status every 30 seconds for demo
    setInterval(updateFlightStatus, 30000);
    
    // Add refresh button for flight info
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = 'Refresh Flight Status';
    refreshBtn.className = 'refresh-btn';
    refreshBtn.style.cssText = `
        background: #005D63;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        margin-top: 10px;
    `;
    
    refreshBtn.addEventListener('click', updateFlightStatus);
    
    document.querySelector('.airport-card').appendChild(refreshBtn);
});