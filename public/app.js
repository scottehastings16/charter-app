// Event action mappings
const EVENT_ACTIONS = {
    app_progress: ['view'],
    user_action: ['click', 'scan', 'play', 'submit', 'download', 'search', 'scroll', 'upload', 'pan']
};

// Store events in memory
let events = [];
let currentImageData = null;
let currentEcomImageData = null;

// DOM Elements
const eventForm = document.getElementById('eventForm');
const event = document.getElementById('event');
const screenName = document.getElementById('screenName');
const eventAction = document.getElementById('eventAction');
const eventLabel = document.getElementById('eventLabel');
const context1 = document.getElementById('context1');
const context2 = document.getElementById('context2');
const context3 = document.getElementById('context3');
const imageUpload = document.getElementById('imageUpload');
const toggleAdditionalContext = document.getElementById('toggleAdditionalContext');
const additionalContextContainer = document.getElementById('additionalContextContainer');
const eventsTable = document.getElementById('eventsTable');
const exportButton = document.getElementById('exportButton');

// E-commerce form elements
const ecommerceEventForm = document.getElementById('ecommerceEventForm');
const ecomImageUpload = document.getElementById('ecomImageUpload');
const ecomEvent = document.getElementById('ecomEvent');
const transactionId = document.getElementById('transactionId');
const locationType = document.getElementById('locationType');
const locationId = document.getElementById('locationId');
const totalValue = document.getElementById('totalValue');
const tax = document.getElementById('tax');
const shipping = document.getElementById('shipping');
const currency = document.getElementById('currency');
const coupon = document.getElementById('coupon');
const paymentMethod = document.getElementById('paymentMethod');
const productsContainer = document.getElementById('productsContainer');
const addProductBtn = document.getElementById('addProductBtn');

// Data Layer Builder elements
const dataLayerForm = document.getElementById('dataLayerForm');
const dlImageUpload = document.getElementById('dlImageUpload');
const dataLayerName = document.getElementById('dataLayerName');
const eventName = document.getElementById('eventName');
const propertiesContainer = document.getElementById('propertiesContainer');
const addPropertyBtn = document.getElementById('addPropertyBtn');
const dataLayerPreview = document.getElementById('dataLayerPreview');
const livePreviewOutput = document.getElementById('livePreviewOutput');

// Tab elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// Error elements
const screenNameError = document.getElementById('screenNameError');
const eventActionError = document.getElementById('eventActionError');
const eventLabelError = document.getElementById('eventLabelError');

// E-commerce error elements
const ecomEventError = document.getElementById('ecomEventError');
const transactionIdError = document.getElementById('transactionIdError');
const locationTypeError = document.getElementById('locationTypeError');
const totalValueError = document.getElementById('totalValueError');
const currencyError = document.getElementById('currencyError');

// Products management
let productCounter = 0;
let products = [];

// Data Layer Builder management
let propertyCounter = 0;
let currentDlImageData = null;

// Settings modal logic
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const saveSettings = document.getElementById('saveSettings');
const cancelSettings = document.getElementById('cancelSettings');
const screenNamePrefixInput = document.getElementById('screenNamePrefix');

settingsBtn.addEventListener('click', () => {
    // Load prefix from localStorage
    const prefix = localStorage.getItem('screenNamePrefix') || '';
    screenNamePrefixInput.value = prefix;
    settingsModal.style.display = 'block';
});
closeSettings.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});
cancelSettings.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});
saveSettings.addEventListener('click', () => {
    localStorage.setItem('screenNamePrefix', screenNamePrefixInput.value);
    settingsModal.style.display = 'none';
    prefillScreenNameWithPrefix();
});
window.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
});

// Helper to get prefix
function getScreenNamePrefix() {
    return localStorage.getItem('screenNamePrefix') || '';
}

// Pre-fill screenName input with prefix on form reset
function prefillScreenNameWithPrefix() {
    const prefix = getScreenNamePrefix();
    if (prefix) {
        screenName.value = prefix;
    } else {
        screenName.value = '';
    }
}

// Tab switching functionality
function switchTab(targetTab) {
    // Remove active class from all buttons and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked button and corresponding content
    const targetButton = document.querySelector(`[data-tab="${targetTab}"]`);
    const targetContent = document.getElementById(targetTab + 'Form');
    
    if (targetButton && targetContent) {
        targetButton.classList.add('active');
        targetContent.classList.add('active');
        
        // Show/hide data layer preview based on active tab
        if (targetTab === 'datalayer') {
            dataLayerPreview.style.display = 'block';
            updateLivePreview();
        } else {
            dataLayerPreview.style.display = 'none';
        }
        
        // Update URL hash
        window.location.hash = targetTab;
    }
}

function initializeTabFromHash() {
    // Get the current hash from URL
    const hash = window.location.hash.substring(1); // Remove the #
    
    // Check if the hash corresponds to a valid tab
    const validTabs = ['experience', 'ecommerce', 'datalayer'];
    const targetTab = validTabs.includes(hash) ? hash : 'experience'; // Default to experience
    
    switchTab(targetTab);
}

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        switchTab(targetTab);
    });
});

// Listen for hash changes (back/forward navigation)
window.addEventListener('hashchange', () => {
    initializeTabFromHash();
});

// Handle image upload for experience events
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        compressImage(file, (compressedDataUrl) => {
            currentImageData = compressedDataUrl;
        });
    } else {
        currentImageData = null;
    }
});

// Handle image upload for e-commerce events
ecomImageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        compressImage(file, (compressedDataUrl) => {
            currentEcomImageData = compressedDataUrl;
        });
    } else {
        currentEcomImageData = null;
    }
});

// Handle image upload for data layer events
dlImageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        compressImage(file, (compressedDataUrl) => {
            currentDlImageData = compressedDataUrl;
        });
    } else {
        currentDlImageData = null;
    }
});

// Handle additional context toggle
toggleAdditionalContext.addEventListener('click', () => {
    const isHidden = additionalContextContainer.style.display === 'none';
    
    if (isHidden) {
        additionalContextContainer.style.display = 'block';
        toggleAdditionalContext.textContent = '- Hide Additional Context';
        toggleAdditionalContext.classList.remove('secondary');
        toggleAdditionalContext.classList.add('primary');
    } else {
        additionalContextContainer.style.display = 'none';
        toggleAdditionalContext.textContent = '+ Add Additional Context';
        toggleAdditionalContext.classList.remove('primary');
        toggleAdditionalContext.classList.add('secondary');
        
        // Clear the fields when hiding
        context1.value = '';
        context2.value = '';
        context3.value = '';
    }
});

// Data Layer Builder functions
function createPropertyItem(index, parentPath = '') {
    const propertyId = `property_${index}`;
    const propertyDiv = document.createElement('div');
    propertyDiv.className = 'property-item';
    propertyDiv.setAttribute('data-property-id', index);
    propertyDiv.setAttribute('data-parent-path', parentPath);
    
    propertyDiv.innerHTML = `
        <div class="property-header" onclick="toggleProperty(${index})">
            <div class="property-title">Property ${index + 1}</div>
            <div class="property-actions">
                <button type="button" class="remove-property-btn" onclick="removeProperty(${index}); event.stopPropagation();">Remove</button>
                <span class="collapse-icon">▼</span>
            </div>
        </div>
        <div class="property-content expanded">
            <div class="property-grid">
                <div class="form-group">
                    <label for="${propertyId}_key">Property Key *</label>
                    <input type="text" id="${propertyId}_key" required placeholder="e.g., pageName, userId, productId" oninput="updateLivePreview()">
                </div>
                <div class="form-group">
                    <label for="${propertyId}_type">Type *</label>
                    <select id="${propertyId}_type" class="property-type-select" required onchange="handleTypeChange(${index}); updateLivePreview()">
                        <option value="">Select type</option>
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="object">Object</option>
                        <option value="array">Array</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="${propertyId}_value">Value</label>
                    <input type="text" id="${propertyId}_value" placeholder="Enter value" oninput="updateLivePreview()">
                </div>
            </div>
            <div class="property-nested-controls">
                <button type="button" class="add-nested-btn" id="${propertyId}_addNested" onclick="addNestedProperty(${index})" style="display: none;">+ Nested</button>
            </div>
            <div id="${propertyId}_nested" class="nested-container" style="display: none;">
                <!-- Nested properties go here -->
            </div>
        </div>
    `;
    
    return propertyDiv;
}

function addProperty() {
    const propertyItem = createPropertyItem(propertyCounter);
    propertiesContainer.appendChild(propertyItem);
    propertyCounter++;
    updatePropertyTitles();
    updateLivePreview();
}

function removeProperty(index) {
    const propertyItem = document.querySelector(`[data-property-id="${index}"]`);
    if (propertyItem) {
        propertyItem.remove();
        updatePropertyTitles();
        updateLivePreview();
    }
}

function toggleProperty(index) {
    const propertyItem = document.querySelector(`[data-property-id="${index}"]`);
    const content = propertyItem.querySelector('.property-content');
    const icon = propertyItem.querySelector('.collapse-icon');
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        icon.classList.add('collapsed');
    } else {
        content.classList.add('expanded');
        icon.classList.remove('collapsed');
    }
}

function updatePropertyTitles() {
    const propertyItems = document.querySelectorAll('.property-item');
    propertyItems.forEach((item, index) => {
        const title = item.querySelector('.property-title');
        title.textContent = `Property ${index + 1}`;
    });
}

function handleTypeChange(index) {
    const typeSelect = document.getElementById(`property_${index}_type`);
    const valueInput = document.getElementById(`property_${index}_value`);
    const addNestedBtn = document.getElementById(`property_${index}_addNested`);
    const nestedContainer = document.getElementById(`property_${index}_nested`);
    
    if (typeSelect.value === 'object' || typeSelect.value === 'array') {
        valueInput.style.display = 'none';
        addNestedBtn.style.display = 'inline-block';
        nestedContainer.style.display = 'block';
    } else {
        valueInput.style.display = 'block';
        addNestedBtn.style.display = 'none';
        nestedContainer.style.display = 'none';
        nestedContainer.innerHTML = ''; // Clear nested properties
    }
    
    updateLivePreview();
}

function addNestedProperty(parentIndex) {
    const nestedContainer = document.getElementById(`property_${parentIndex}_nested`);
    const nestedProperty = createPropertyItem(propertyCounter, `property_${parentIndex}`);
    nestedContainer.appendChild(nestedProperty);
    propertyCounter++;
    updateLivePreview();
}

function buildDataLayerObject() {
    const eventName = document.getElementById('eventName').value;
    const result = {
        event: eventName // Always include the event name with key "event"
    };
    
    const propertyItems = document.querySelectorAll('.property-item[data-parent-path=""]');
    
    propertyItems.forEach(item => {
        const propertyId = item.getAttribute('data-property-id');
        const key = document.getElementById(`property_${propertyId}_key`).value;
        const type = document.getElementById(`property_${propertyId}_type`).value;
        const value = document.getElementById(`property_${propertyId}_value`).value;
        
        // Skip if the key is "event" since we already have it
        if (key && key !== 'event') {
            result[key] = getPropertyValue(propertyId, type, value);
        }
    });
    
    return result;
}

function getPropertyValue(propertyId, type, value) {
    switch (type) {
        case 'string':
            return value || '';
        case 'number':
            return value ? parseFloat(value) : 0;
        case 'boolean':
            return value === 'true';
        case 'object':
            return buildNestedObject(propertyId);
        case 'array':
            return buildNestedArray(propertyId);
        default:
            return value;
    }
}

function buildNestedObject(parentPropertyId) {
    const result = {};
    const nestedContainer = document.getElementById(`property_${parentPropertyId}_nested`);
    const nestedItems = nestedContainer.querySelectorAll('.property-item');
    
    nestedItems.forEach(item => {
        const propertyId = item.getAttribute('data-property-id');
        const key = document.getElementById(`property_${propertyId}_key`).value;
        const type = document.getElementById(`property_${propertyId}_type`).value;
        const value = document.getElementById(`property_${propertyId}_value`).value;
        
        if (key) {
            result[key] = getPropertyValue(propertyId, type, value);
        }
    });
    
    return result;
}

function buildNestedArray(parentPropertyId) {
    const result = [];
    const nestedContainer = document.getElementById(`property_${parentPropertyId}_nested`);
    const nestedItems = nestedContainer.querySelectorAll('.property-item');
    
    nestedItems.forEach(item => {
        const propertyId = item.getAttribute('data-property-id');
        const type = document.getElementById(`property_${propertyId}_type`).value;
        const value = document.getElementById(`property_${propertyId}_value`).value;
        
        result.push(getPropertyValue(propertyId, type, value));
    });
    
    return result;
}

// Add event listeners for real-time preview updates
dataLayerName.addEventListener('change', updateLivePreview);
eventName.addEventListener('input', updateLivePreview);

function updateLivePreview() {
    const dataLayerName = document.getElementById('dataLayerName').value;
    const eventName = document.getElementById('eventName').value;
    
    if (!dataLayerName) {
        livePreviewOutput.textContent = '// Select data layer to see preview';
        return;
    }

    if (!eventName) {
        livePreviewOutput.textContent = '// Enter event name to see preview';
        return;
    }

    const dataLayerObject = buildDataLayerObject();
    if (!dataLayerObject || !dataLayerObject.event) {
        livePreviewOutput.textContent = '// Add properties to see preview';
        return;
    }

    // Format the preview based on the selected data layer
    let preview = '';
    switch (dataLayerName) {
        case 'dataLayer':
        case 'adobeDataLayer':
        case 'digitalData':
            preview = `${dataLayerName}.push(${JSON.stringify(dataLayerObject, null, 2)});`;
            break;
    }

    livePreviewOutput.textContent = preview;
}

// Add property button event listener
addPropertyBtn.addEventListener('click', addProperty);

// Initialize with one property
addProperty();

// Product management functions
function createProductItem(index) {
    const productId = `product_${index}`;
    const productDiv = document.createElement('div');
    productDiv.className = 'product-item';
    productDiv.setAttribute('data-product-id', index);
    
    productDiv.innerHTML = `
        <div class="product-header" onclick="toggleProduct(${index})">
            <div class="product-title">Product ${index + 1}</div>
            <div class="product-actions">
                <button type="button" class="remove-product-btn" onclick="removeProduct(${index}); event.stopPropagation();">Remove</button>
                <span class="collapse-icon">▼</span>
            </div>
        </div>
        <div class="product-content expanded">
            <div class="product-grid">
                <div class="form-group">
                    <label for="${productId}_itemId">Item ID *</label>
                    <input type="text" id="${productId}_itemId" required placeholder="e.g., SKU12345">
                    <span class="error" id="${productId}_itemIdError"></span>
                </div>
                <div class="form-group">
                    <label for="${productId}_itemName">Item Name *</label>
                    <input type="text" id="${productId}_itemName" required placeholder="e.g., Sprite Zero Sugar">
                    <span class="error" id="${productId}_itemNameError"></span>
                </div>
                <div class="form-group">
                    <label for="${productId}_itemBrand">Item Brand</label>
                    <input type="text" id="${productId}_itemBrand" placeholder="e.g., Sprite">
                </div>
                <div class="form-group">
                    <label for="${productId}_itemPrice">Item Price *</label>
                    <input type="number" id="${productId}_itemPrice" step="0.01" required placeholder="2.99">
                    <span class="error" id="${productId}_itemPriceError"></span>
                </div>
                <div class="form-group">
                    <label for="${productId}_quantity">Quantity *</label>
                    <input type="number" id="${productId}_quantity" min="1" required placeholder="2">
                    <span class="error" id="${productId}_quantityError"></span>
                </div>
                <div class="form-group">
                    <label for="${productId}_category">Category</label>
                    <input type="text" id="${productId}_category" placeholder="e.g., Beverages">
                </div>
                <div class="form-group">
                    <label for="${productId}_variant">Variant</label>
                    <input type="text" id="${productId}_variant" placeholder="e.g., 12 oz Can">
                </div>
            </div>
        </div>
    `;
    
    return productDiv;
}

function addProduct() {
    const productItem = createProductItem(productCounter);
    productsContainer.appendChild(productItem);
    productCounter++;
    updateProductTitles();
}

function removeProduct(index) {
    const productItem = document.querySelector(`[data-product-id="${index}"]`);
    if (productItem) {
        productItem.remove();
        updateProductTitles();
    }
}

function toggleProduct(index) {
    const productItem = document.querySelector(`[data-product-id="${index}"]`);
    const content = productItem.querySelector('.product-content');
    const icon = productItem.querySelector('.collapse-icon');
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        icon.classList.add('collapsed');
    } else {
        content.classList.add('expanded');
        icon.classList.remove('collapsed');
    }
}

function updateProductTitles() {
    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach((item, index) => {
        const title = item.querySelector('.product-title');
        title.textContent = `Product ${index + 1}`;
    });
}

function getAllProducts() {
    const productItems = document.querySelectorAll('.product-item');
    const products = [];
    
    productItems.forEach((item, index) => {
        const productId = item.getAttribute('data-product-id');
        const itemId = document.getElementById(`product_${productId}_itemId`).value;
        const itemName = document.getElementById(`product_${productId}_itemName`).value;
        const itemBrand = document.getElementById(`product_${productId}_itemBrand`).value;
        const itemPrice = document.getElementById(`product_${productId}_itemPrice`).value;
        const quantity = document.getElementById(`product_${productId}_quantity`).value;
        const category = document.getElementById(`product_${productId}_category`).value;
        const variant = document.getElementById(`product_${productId}_variant`).value;
        
        if (itemId && itemName && itemPrice && quantity) {
            products.push({
                item_id: itemId,
                item_name: itemName,
                item_brand: itemBrand || undefined,
                price: parseFloat(itemPrice),
                quantity: parseInt(quantity),
                category: category || undefined,
                variant: variant || undefined
            });
        }
    });
    
    return products;
}

// Add product button event listener
addProductBtn.addEventListener('click', addProduct);

// Initialize with one product
addProduct();

// Function to determine event category based on action
function getEventCategory(action) {
    if (EVENT_ACTIONS.app_progress.includes(action)) {
        return 'app_progress';
    } else if (EVENT_ACTIONS.user_action.includes(action)) {
        return 'user_action';
    }
    return '';
}

// Form validation
function validateForm() {
    let isValid = true;
    const errors = {
        screenName: '',
        eventAction: '',
        eventLabel: ''
    };

    if (!screenName.value) {
        errors.screenName = 'Screen name is required';
        isValid = false;
    }

    if (!eventAction.value) {
        errors.eventAction = 'Event action is required';
        isValid = false;
    }

    if (!eventLabel.value) {
        errors.eventLabel = 'Event label is required';
        isValid = false;
    }

    // Display errors
    screenNameError.textContent = errors.screenName;
    eventActionError.textContent = errors.eventAction;
    eventLabelError.textContent = errors.eventLabel;

    return isValid;
}

// Generate data layer format
function generateDataLayer(eventData) {
    const dataLayer = {
        event_category: eventData.event_category,
        event_action: eventData.event_action,
        event_label: eventData.event_label,
        screen_name: eventData.screen_name
    };

    // Create optional_params object if any additional context is provided
    const optionalParams = {};
    if (eventData.additional_context_1) {
        optionalParams.additional_context_1 = eventData.additional_context_1;
    }
    if (eventData.additional_context_2) {
        optionalParams.additional_context_2 = eventData.additional_context_2;
    }
    if (eventData.additional_context_3) {
        optionalParams.additional_context_3 = eventData.additional_context_3;
    }

    // Only add optional_params if there are any values
    if (Object.keys(optionalParams).length > 0) {
        dataLayer.optional_params = optionalParams;
    }

    return `xtnd.analytics.send(${JSON.stringify(dataLayer, null, 2)});`;
}

// Generate tagging plan
function generateTaggingPlan(eventData) {
    if (eventData.event_category === 'datalayer') {
        let output = '';
        
        function formatObject(obj, indent = '') {
            let result = '';
            for (const [key, value] of Object.entries(obj)) {
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    result += `${indent}${key}:<br>`;
                    result += formatObject(value, indent + '&nbsp;&nbsp;');
                } else if (Array.isArray(value)) {
                    result += `${indent}${key}: [${value.join(', ')}]<br>`;
                } else {
                    result += `${indent}${key}: ${value}<br>`;
                }
            }
            return result;
        }
        
        output = formatObject(eventData.dataLayer);
        return output;
    } else if (eventData.event_category === 'ecommerce') {
        let output = `event: ${eventData.event}<br>`;
        output += `event_category: ${eventData.event_category}<br>`;
        output += `transaction_id: ${eventData.ecommerce.transaction_id}<br>`;
        output += `location_type: ${eventData.ecommerce.location_type}<br>`;
        if (eventData.ecommerce.location_id) {
            output += `location_id: ${eventData.ecommerce.location_id}<br>`;
        }
        output += `value: ${eventData.ecommerce.value}<br>`;
        if (eventData.ecommerce.tax) {
            output += `tax: ${eventData.ecommerce.tax}<br>`;
        }
        if (eventData.ecommerce.shipping) {
            output += `shipping: ${eventData.ecommerce.shipping}<br>`;
        }
        output += `currency: ${eventData.ecommerce.currency}<br>`;
        if (eventData.ecommerce.coupon) {
            output += `coupon: ${eventData.ecommerce.coupon}<br>`;
        }
        if (eventData.ecommerce.payment_method) {
            output += `payment_method: ${eventData.ecommerce.payment_method}<br>`;
        }
        
        eventData.ecommerce.items.forEach((item, index) => {
            output += `<br><strong>Item ${index + 1}:</strong><br>`;
            output += `&nbsp;&nbsp;item_id: ${item.item_id}<br>`;
            output += `&nbsp;&nbsp;item_name: ${item.item_name}<br>`;
            if (item.item_brand) {
                output += `&nbsp;&nbsp;item_brand: ${item.item_brand}<br>`;
            }
            output += `&nbsp;&nbsp;price: ${item.price}<br>`;
            output += `&nbsp;&nbsp;quantity: ${item.quantity}<br>`;
            if (item.category) {
                output += `&nbsp;&nbsp;category: ${item.category}<br>`;
            }
            if (item.variant) {
                output += `&nbsp;&nbsp;variant: ${item.variant}<br>`;
            }
        });
        
        return output;
    } else {
        let output = `event_category: ${eventData.event_category}<br>`;
        output += `event_action: ${eventData.event_action}<br>`;
        output += `event_label: ${eventData.event_label}<br>`;
        output += `screen_name: ${eventData.screen_name}<br>`;
        
        // Check if any additional context exists to show nested structure
        const hasAdditionalContext = eventData.additional_context_1 || 
                                   eventData.additional_context_2 || 
                                   eventData.additional_context_3;
        
        if (hasAdditionalContext) {
            output += `<br><strong>optional_params:</strong><br>`;
            if (eventData.additional_context_1) {
                output += `&nbsp;&nbsp;additional_context_1: ${eventData.additional_context_1}<br>`;
            }
            if (eventData.additional_context_2) {
                output += `&nbsp;&nbsp;additional_context_2: ${eventData.additional_context_2}<br>`;
            }
            if (eventData.additional_context_3) {
                output += `&nbsp;&nbsp;additional_context_3: ${eventData.additional_context_3}<br>`;
            }
        }
        
        return output;
    }
}

// Generate e-commerce data layer
function generateEcommerceDataLayer(eventData) {
    const ecommerceObj = {
        event: eventData.event,
        event_category: 'ecommerce',
        ecommerce: eventData.ecommerce
    };
    
    return `xtnd.analytics.send(${JSON.stringify(ecommerceObj, null, 2)});`;
}

// Generate custom data layer
function generateCustomDataLayer(eventData) {
    return `dataLayer.push(${JSON.stringify(eventData.dataLayer, null, 2)});`;
}

// Validate e-commerce form
function validateEcommerceForm() {
    let isValid = true;

    // Clear all existing errors
    document.querySelectorAll('.error').forEach(error => {
        if (error.id.includes('product_')) {
            error.textContent = '';
        }
    });

    // Validate transaction fields
    if (!ecomEvent.value) {
        ecomEventError.textContent = 'Event type is required';
        isValid = false;
    } else {
        ecomEventError.textContent = '';
    }

    if (!transactionId.value) {
        transactionIdError.textContent = 'Transaction ID is required';
        isValid = false;
    } else {
        transactionIdError.textContent = '';
    }

    if (!locationType.value) {
        locationTypeError.textContent = 'Location type is required';
        isValid = false;
    } else {
        locationTypeError.textContent = '';
    }

    if (!totalValue.value || totalValue.value <= 0) {
        totalValueError.textContent = 'Total value is required and must be greater than 0';
        isValid = false;
    } else {
        totalValueError.textContent = '';
    }

    if (!currency.value) {
        currencyError.textContent = 'Currency is required';
        isValid = false;
    } else {
        currencyError.textContent = '';
    }

    // Validate products
    const productItems = document.querySelectorAll('.product-item');
    let hasValidProducts = false;

    productItems.forEach((item) => {
        const productId = item.getAttribute('data-product-id');
        const itemId = document.getElementById(`product_${productId}_itemId`);
        const itemName = document.getElementById(`product_${productId}_itemName`);
        const itemPrice = document.getElementById(`product_${productId}_itemPrice`);
        const quantity = document.getElementById(`product_${productId}_quantity`);

        const itemIdError = document.getElementById(`product_${productId}_itemIdError`);
        const itemNameError = document.getElementById(`product_${productId}_itemNameError`);
        const itemPriceError = document.getElementById(`product_${productId}_itemPriceError`);
        const quantityError = document.getElementById(`product_${productId}_quantityError`);

        let productValid = true;

        if (!itemId.value) {
            itemIdError.textContent = 'Item ID is required';
            productValid = false;
            isValid = false;
        } else {
            itemIdError.textContent = '';
        }

        if (!itemName.value) {
            itemNameError.textContent = 'Item name is required';
            productValid = false;
            isValid = false;
        } else {
            itemNameError.textContent = '';
        }

        if (!itemPrice.value || itemPrice.value <= 0) {
            itemPriceError.textContent = 'Item price is required and must be greater than 0';
            productValid = false;
            isValid = false;
        } else {
            itemPriceError.textContent = '';
        }

        if (!quantity.value || quantity.value <= 0) {
            quantityError.textContent = 'Quantity is required and must be greater than 0';
            productValid = false;
            isValid = false;
        } else {
            quantityError.textContent = '';
        }

        if (productValid) {
            hasValidProducts = true;
        }
    });

    // Check if at least one product exists
    if (productItems.length === 0) {
        alert('Please add at least one product');
        isValid = false;
    }

    return isValid && hasValidProducts;
}

// Handle experience form submission
eventForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateForm()) {
        const eventCategory = getEventCategory(eventAction.value);
        
        const newEvent = {
            event: event.value,
            event_category: eventCategory,
            event_action: eventAction.value,
            event_label: eventLabel.value,
            screen_name: screenName.value,
            additional_context_1: context1.value || '',
            additional_context_2: context2.value || '',
            additional_context_3: context3.value || '',
            image: currentImageData // Store the image data with the event
        };

        events.push(newEvent);
        updateTable();
        autoSaveToActiveProject(); // Auto-save after generating event
        resetForm();
    }
});

// Handle e-commerce form submission
ecommerceEventForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateEcommerceForm()) {
        const products = getAllProducts();
        
        const newEvent = {
            event: ecomEvent.value,
            event_category: 'ecommerce',
            ecommerce: {
                transaction_id: transactionId.value,
                location_type: locationType.value,
                location_id: locationId.value || undefined,
                value: parseFloat(totalValue.value),
                tax: tax.value ? parseFloat(tax.value) : undefined,
                shipping: shipping.value ? parseFloat(shipping.value) : undefined,
                currency: currency.value,
                coupon: coupon.value || undefined,
                payment_method: paymentMethod.value || undefined,
                items: products
            },
            image: currentEcomImageData
        };

        events.push(newEvent);
        updateTable();
        autoSaveToActiveProject(); // Auto-save after generating event
        resetEcommerceForm();
    }
});

// Handle data layer form submission
dataLayerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const dataLayerObject = buildDataLayerObject();
    
    if (Object.keys(dataLayerObject).length === 0) {
        alert('Please add at least one property');
        return;
    }

    const newEvent = {
        event_category: 'datalayer',
        dataLayer: dataLayerObject,
        image: currentDlImageData
    };

    events.push(newEvent);
    updateTable();
    autoSaveToActiveProject(); // Auto-save after generating event
    resetDataLayerForm();
});


// Reset experience form
function resetForm() {
    eventForm.reset();
    event.value = 'experience_event'; // Reset the readonly field
    currentImageData = null; // Clear the image data
    
    // Reset additional context toggle
    additionalContextContainer.style.display = 'none';
    toggleAdditionalContext.textContent = '+ Add Additional Context';
    toggleAdditionalContext.classList.remove('primary');
    toggleAdditionalContext.classList.add('secondary');
    
    // Clear errors
    screenNameError.textContent = '';
    eventActionError.textContent = '';
    eventLabelError.textContent = '';
    prefillScreenNameWithPrefix();
}

// Reset e-commerce form
function resetEcommerceForm() {
    ecommerceEventForm.reset();
    currentEcomImageData = null; // Clear the image data
    
    // Clear all products and reset counter
    productsContainer.innerHTML = '';
    productCounter = 0;
    
    // Add one default product
    addProduct();
    
    // Clear errors
    ecomEventError.textContent = '';
    transactionIdError.textContent = '';
    locationTypeError.textContent = '';
    totalValueError.textContent = '';
    currencyError.textContent = '';
}

// Reset data layer form
function resetDataLayerForm() {
    dataLayerForm.reset();
    currentDlImageData = null; // Clear the image data
    
    // Clear all properties and reset counter
    propertiesContainer.innerHTML = '';
    propertyCounter = 0;
    
    // Add one default property
    addProperty();
}

// Update table with events
function updateTable() {
    const tbody = eventsTable.querySelector('tbody');
    tbody.innerHTML = '';

    events.forEach((event, index) => {
        const row = document.createElement('tr');
        
        // Generate image column
        const imageCell = event.image 
            ? `<img src="${event.image}" alt="Event" class="table-image">`
            : '<span class="no-image">No Image</span>';
        
        // Generate data layer specifications based on event type
        let dataLayerCode;
        if (event.event_category === 'ecommerce') {
            dataLayerCode = generateEcommerceDataLayer(event);
        } else if (event.event_category === 'datalayer') {
            dataLayerCode = generateCustomDataLayer(event);
        } else {
            dataLayerCode = generateDataLayer(event);
        }
        
        // Generate tagging plan
        const taggingPlan = generateTaggingPlan(event);
        
        row.innerHTML = `
            <td class="image-column">${imageCell}</td>
            <td class="data-layer-column">
                <div class="table-code">${dataLayerCode}</div>
            </td>
            <td class="tagging-plan-column">
                <div class="table-tagging">${taggingPlan}</div>
            </td>
            <td class="options-column">
                <button class="delete-btn" onclick="deleteEvent(${index})" title="Delete Event">
                    🗑️
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Delete event
function deleteEvent(index) {
    events.splice(index, 1);
    updateTable();
    autoSaveToActiveProject(); // Auto-save after deleting event
}

// Enhanced Save and Load Progress functionality with multiple named projects
const saveProgressButton = document.getElementById('saveProgressButton');
const loadProgressButton = document.getElementById('loadProgressButton');
const storageManagementButton = document.getElementById('storageManagementButton');

// Active project tracking
let currentActiveProject = null;
const activeProjectIndicator = document.getElementById('activeProjectIndicator');
const activeProjectName = document.getElementById('activeProjectName');
const autoSaveStatus = document.getElementById('autoSaveStatus');
const stopWorkingButton = document.getElementById('stopWorkingButton');

// Modal elements
const saveProjectModal = document.getElementById('saveProjectModal');
const loadProjectModal = document.getElementById('loadProjectModal');
const storageManagementModal = document.getElementById('storageManagementModal');
const closeSaveProject = document.getElementById('closeSaveProject');
const closeLoadProject = document.getElementById('closeLoadProject');
const closeStorageManagement = document.getElementById('closeStorageManagement');
const confirmSaveProject = document.getElementById('confirmSaveProject');
const cancelSaveProject = document.getElementById('cancelSaveProject');
const cancelLoadProject = document.getElementById('cancelLoadProject');
const cancelStorageManagement = document.getElementById('cancelStorageManagement');
const projectNameInput = document.getElementById('projectName');
const projectDescriptionInput = document.getElementById('projectDescription');
const projectsList = document.getElementById('projectsList');

// Storage management elements
const storageBarFill = document.getElementById('storageBarFill');
const storageUsed = document.getElementById('storageUsed');
const storageTotal = document.getElementById('storageTotal');
const storagePercent = document.getElementById('storagePercent');
const storageWarning = document.getElementById('storageWarning');
const storageWarningText = document.getElementById('storageWarningText');
const projectSizes = document.getElementById('projectSizes');
const exportAllProjectsButton = document.getElementById('exportAllProjectsButton');
const clearAllProjectsButton = document.getElementById('clearAllProjectsButton');

// Show save project modal
saveProgressButton.addEventListener('click', () => {
    if (events.length === 0) {
        alert('No events to save!');
        return;
    }
    
    // Clear form and show modal
    projectNameInput.value = '';
    projectDescriptionInput.value = '';
    saveProjectModal.style.display = 'block';
    projectNameInput.focus();
});

// Show load project modal
loadProgressButton.addEventListener('click', () => {
    populateProjectsList();
    loadProjectModal.style.display = 'block';
});

// Show storage management modal
storageManagementButton.addEventListener('click', () => {
    updateStorageInfo();
    storageManagementModal.style.display = 'block';
});

// Close modals
closeSaveProject.addEventListener('click', () => {
    saveProjectModal.style.display = 'none';
});

closeLoadProject.addEventListener('click', () => {
    loadProjectModal.style.display = 'none';
});

closeStorageManagement.addEventListener('click', () => {
    storageManagementModal.style.display = 'none';
});

cancelSaveProject.addEventListener('click', () => {
    saveProjectModal.style.display = 'none';
});

cancelLoadProject.addEventListener('click', () => {
    loadProjectModal.style.display = 'none';
});

cancelStorageManagement.addEventListener('click', () => {
    storageManagementModal.style.display = 'none';
});

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === saveProjectModal) {
        saveProjectModal.style.display = 'none';
    }
    if (event.target === loadProjectModal) {
        loadProjectModal.style.display = 'none';
    }
    if (event.target === storageManagementModal) {
        storageManagementModal.style.display = 'none';
    }
});

// Save project
confirmSaveProject.addEventListener('click', () => {
    const projectName = projectNameInput.value.trim();
    if (!projectName) {
        alert('Please enter a project name!');
        return;
    }
    
    try {
        const projectData = {
            name: projectName,
            description: projectDescriptionInput.value.trim(),
            events: events,
            timestamp: new Date().toISOString(),
            version: '1.0',
            eventCount: events.length
        };
        
        // Get existing projects
        const existingProjects = getStoredProjects();
        
        // Check if project name already exists
        if (existingProjects.some(p => p.name === projectName)) {
            const overwrite = confirm(`A project named "${projectName}" already exists. Do you want to overwrite it?`);
            if (!overwrite) return;
        }
        
        // Remove existing project with same name
        const filteredProjects = existingProjects.filter(p => p.name !== projectName);
        
        // Add new project
        filteredProjects.push(projectData);
        
        // Save to localStorage
        localStorage.setItem('analyticsEventGenerator_projects', JSON.stringify(filteredProjects));
        
        // Set as active project
        setActiveProject(projectName);
        
        saveProjectModal.style.display = 'none';
        
        // Show success feedback
        const originalText = saveProgressButton.textContent;
        saveProgressButton.textContent = '✅ Saved!';
        saveProgressButton.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            saveProgressButton.textContent = originalText;
            saveProgressButton.style.backgroundColor = '';
        }, 2000);
        
    } catch (error) {
        console.error('Error saving project:', error);
        if (error.name === 'QuotaExceededError') {
            alert('❌ Storage is full! Cannot save project.\n\nPlease:\n1. Open Storage Management (🗂️ Storage)\n2. Export important projects\n3. Clear old projects\n4. Try again');
        } else {
            alert('Failed to save project. Your browser storage might be full.');
        }
    }
});

// Get stored projects
function getStoredProjects() {
    try {
        const stored = localStorage.getItem('analyticsEventGenerator_projects');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading stored projects:', error);
        return [];
    }
}

// Populate projects list
function populateProjectsList() {
    const projects = getStoredProjects();
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<div class="no-projects">No saved projects found.<br>Create your first project by clicking "Save Progress"!</div>';
        return;
    }
    
    // Sort projects by timestamp (newest first)
    projects.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    projectsList.innerHTML = projects.map(project => `
        <div class="project-item">
            <div class="project-info">
                <div class="project-name">${escapeHtml(project.name)}</div>
                <div class="project-meta">
                    ${project.eventCount} event${project.eventCount !== 1 ? 's' : ''} • 
                    Saved ${formatDate(project.timestamp)}
                </div>
                ${project.description ? `<div class="project-description">${escapeHtml(project.description)}</div>` : ''}
            </div>
            <div class="project-actions">
                <button class="project-load-btn" onclick="loadProject('${escapeHtml(project.name)}')">Load</button>
                <button class="project-delete-btn" onclick="deleteProject('${escapeHtml(project.name)}')">🗑️</button>
            </div>
        </div>
    `).join('');
}

// Load a specific project
function loadProject(projectName) {
    try {
        const projects = getStoredProjects();
        const project = projects.find(p => p.name === projectName);
        
        if (!project) {
            alert('Project not found!');
            return;
        }
        
        // Confirm before loading (this will overwrite current work)
        const confirmLoad = confirm(`Load "${project.name}"?\n\nThis will replace your current work with ${project.eventCount} event${project.eventCount !== 1 ? 's' : ''} from ${formatDate(project.timestamp)}.`);
        
        if (confirmLoad) {
            events.length = 0; // Clear current events
            events.push(...project.events); // Load saved events
            updateTable();
            
            // Set as active project
            setActiveProject(projectName);
            
            loadProjectModal.style.display = 'none';
            
            // Show success feedback
            const originalText = loadProgressButton.textContent;
            loadProgressButton.textContent = '✅ Loaded!';
            loadProgressButton.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                loadProgressButton.textContent = originalText;
                loadProgressButton.style.backgroundColor = '';
            }, 2000);
        }
        
    } catch (error) {
        console.error('Error loading project:', error);
        alert('Failed to load project. The saved data might be corrupted.');
    }
}

// Delete a specific project
function deleteProject(projectName) {
    const confirmDelete = confirm(`Are you sure you want to delete "${projectName}"?\n\nThis action cannot be undone.`);
    
    if (confirmDelete) {
        try {
            const projects = getStoredProjects();
            const filteredProjects = projects.filter(p => p.name !== projectName);
            
            localStorage.setItem('analyticsEventGenerator_projects', JSON.stringify(filteredProjects));
            populateProjectsList(); // Refresh the list
            
            // If this was the active project, clear it
            if (currentActiveProject === projectName) {
                clearActiveProject();
            }
            
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project.');
        }
    }
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
}

// Active Project Management Functions
function setActiveProject(projectName) {
    currentActiveProject = projectName;
    activeProjectName.textContent = projectName;
    activeProjectIndicator.style.display = 'flex';
    autoSaveStatus.textContent = 'Auto-saving enabled';
    autoSaveStatus.className = 'auto-save-status saved';
    
    // Store active project in localStorage for persistence
    localStorage.setItem('analyticsEventGenerator_activeProject', projectName);
}

function clearActiveProject() {
    currentActiveProject = null;
    activeProjectIndicator.style.display = 'none';
    
    // Remove from localStorage
    localStorage.removeItem('analyticsEventGenerator_activeProject');
}

function autoSaveToActiveProject() {
    if (!currentActiveProject || events.length === 0) return;
    
    // Show saving status
    autoSaveStatus.textContent = 'Auto-saving...';
    autoSaveStatus.className = 'auto-save-status saving';
    
    try {
        const projects = getStoredProjects();
        const projectIndex = projects.findIndex(p => p.name === currentActiveProject);
        
        if (projectIndex === -1) {
            console.warn('Active project not found, stopping auto-save');
            clearActiveProject();
            return;
        }
        
        // Update the project with current events
        projects[projectIndex] = {
            ...projects[projectIndex],
            events: events,
            timestamp: new Date().toISOString(),
            eventCount: events.length
        };
        
        // Save to localStorage
        localStorage.setItem('analyticsEventGenerator_projects', JSON.stringify(projects));
        
        // Show saved status
        autoSaveStatus.textContent = 'Auto-saved';
        autoSaveStatus.className = 'auto-save-status saved';
        
        // Reset to normal status after 2 seconds
        setTimeout(() => {
            if (autoSaveStatus.textContent === 'Auto-saved') {
                autoSaveStatus.textContent = 'Auto-saving enabled';
            }
        }, 2000);
        
    } catch (error) {
        console.error('Auto-save failed:', error);
        autoSaveStatus.textContent = 'Auto-save failed';
        autoSaveStatus.className = 'auto-save-status';
        
        setTimeout(() => {
            autoSaveStatus.textContent = 'Auto-saving enabled';
            autoSaveStatus.className = 'auto-save-status saved';
        }, 3000);
    }
}

function restoreActiveProject() {
    const savedActiveProject = localStorage.getItem('analyticsEventGenerator_activeProject');
    if (savedActiveProject) {
        // Verify the project still exists and load its events
        const projects = getStoredProjects();
        const project = projects.find(p => p.name === savedActiveProject);
        
        if (project) {
            // Load the project's events into the current session
            events.length = 0; // Clear current events
            events.push(...project.events); // Load saved events
            updateTable(); // Update the UI
            
            // Set as active project (this updates the UI indicator)
            setActiveProject(savedActiveProject);
            
            console.log(`Restored active project: ${savedActiveProject} with ${project.events.length} events`);
        } else {
            // Project was deleted, clear the active project
            localStorage.removeItem('analyticsEventGenerator_activeProject');
            console.log(`Active project ${savedActiveProject} no longer exists, cleared from storage`);
        }
    }
}

// Stop working button handler
stopWorkingButton.addEventListener('click', () => {
    const confirmStop = confirm(`Stop working on "${currentActiveProject}"?\n\nAuto-save will be disabled, but your progress is already saved.`);
    if (confirmStop) {
        clearActiveProject();
    }
});

// Image Compression Function
function compressImage(file, callback, maxWidth = 800, maxHeight = 600, quality = 0.8) {
    const originalSize = file.size;
    
    // Create a new image element
    const img = new Image();
    img.onload = function() {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        
        if (width > height) {
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress the image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to data URL with compression
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Calculate compression savings
        const compressedSize = Math.round(compressedDataUrl.length * 0.75); // Approximate size
        const savings = Math.round(((originalSize - compressedSize) / originalSize) * 100);
        
        console.log(`Image compressed: ${formatBytes(originalSize)} → ${formatBytes(compressedSize)} (${savings}% reduction)`);
        console.log(`Dimensions: ${img.width}x${img.height} → ${width}x${height}`);
        
        callback(compressedDataUrl);
    };
    
    img.onerror = function() {
        console.error('Error loading image for compression');
        // Fallback to original file
        const reader = new FileReader();
        reader.onload = (e) => callback(e.target.result);
        reader.readAsDataURL(file);
    };
    
    // Load the image
    const reader = new FileReader();
    reader.onload = (e) => {
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Storage Management Functions
function getStorageUsage() {
    let totalSize = 0;
    const storageData = {};
    
    // Calculate size of all localStorage items for this domain
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            const value = localStorage[key];
            const size = new Blob([value]).size;
            totalSize += size;
            
            if (key.startsWith('analyticsEventGenerator_')) {
                storageData[key] = {
                    size: size,
                    sizeFormatted: formatBytes(size)
                };
            }
        }
    }
    
    return {
        total: totalSize,
        totalFormatted: formatBytes(totalSize),
        breakdown: storageData
    };
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function calculateStoragePercentage(usedBytes) {
    // localStorage typical limit is around 5-10MB, we'll estimate 5MB
    const estimatedLimit = 5 * 1024 * 1024; // 5MB in bytes
    return Math.min((usedBytes / estimatedLimit) * 100, 100);
}

function updateStorageInfo() {
    const usage = getStorageUsage();
    const percentage = calculateStoragePercentage(usage.total);
    
    // Update storage bar
    storageBarFill.style.width = `${percentage}%`;
    storageUsed.textContent = usage.totalFormatted;
    storagePercent.textContent = `${Math.round(percentage)}%`;
    
    // Show warnings based on usage
    if (percentage >= 90) {
        storageWarning.style.display = 'block';
        storageWarning.className = 'storage-alert critical';
        storageWarningText.textContent = 'Storage is critically full! Export your projects immediately and clear unnecessary data.';
    } else if (percentage >= 75) {
        storageWarning.style.display = 'block';
        storageWarning.className = 'storage-alert';
        storageWarningText.textContent = 'Storage is getting full. Consider exporting projects and cleaning up old data.';
    } else {
        storageWarning.style.display = 'none';
    }
    
    // Update project breakdown
    updateProjectSizeBreakdown();
    
    return { usage, percentage };
}

function updateProjectSizeBreakdown() {
    const projects = getStoredProjects();
    
    if (projects.length === 0) {
        projectSizes.innerHTML = '<div class="no-projects-storage">No projects saved</div>';
        return;
    }
    
    // Calculate size for each project
    const projectSizeData = projects.map(project => {
        const projectString = JSON.stringify(project);
        const size = new Blob([projectString]).size;
        return {
            ...project,
            size: size,
            sizeFormatted: formatBytes(size)
        };
    });
    
    // Sort by size (largest first)
    projectSizeData.sort((a, b) => b.size - a.size);
    
    projectSizes.innerHTML = projectSizeData.map(project => `
        <div class="project-size-item">
            <div class="project-size-info">
                <div class="project-size-name">${escapeHtml(project.name)}</div>
                <div class="project-size-details">
                    ${project.eventCount} event${project.eventCount !== 1 ? 's' : ''} • 
                    ${formatDate(project.timestamp)}
                </div>
            </div>
            <div class="project-size-value">${project.sizeFormatted}</div>
        </div>
    `).join('');
}



// Clear all projects
clearAllProjectsButton.addEventListener('click', () => {
    const projects = getStoredProjects();
    
    if (projects.length === 0) {
        alert('No projects to clear!');
        return;
    }
    
    const confirmClear = confirm(`⚠️ DANGER: Clear ALL ${projects.length} project(s)?\n\nThis will permanently delete:\n• All saved projects\n• All images\n• All event specifications\n\nThis action CANNOT be undone!\n\nMake sure you've exported important projects to Excel first.`);
    
    if (confirmClear) {
        const finalConfirm = confirm('Are you ABSOLUTELY SURE?\n\nType "DELETE" in the next prompt to confirm.');
        
        if (finalConfirm) {
            const confirmText = prompt('Type "DELETE" to confirm clearing all projects:');
            
            if (confirmText === 'DELETE') {
                try {
                    // Clear all project-related localStorage
                    localStorage.removeItem('analyticsEventGenerator_projects');
                    localStorage.removeItem('analyticsEventGenerator_autoSave');
                    
                    // Clear active project
                    clearActiveProject();
                    
                    // Update storage info
                    updateStorageInfo();
                    
                    alert('✅ All projects have been cleared successfully!');
                    
                    storageManagementModal.style.display = 'none';
                    
                } catch (error) {
                    console.error('Error clearing projects:', error);
                    alert('❌ Failed to clear projects. Please try refreshing the page.');
                }
            } else {
                alert('Clearing cancelled - text did not match "DELETE"');
            }
        }
    }
});

// Export all projects
exportAllProjectsButton.addEventListener('click', async () => {
    const projects = getStoredProjects();
    
    if (projects.length === 0) {
        alert('No projects to export!');
        return;
    }
    
    // Flatten all events from all projects
    const allEvents = projects.flatMap(project => project.events);
    
    if (allEvents.length === 0) {
        alert('No events found in projects!');
        return;
    }
    
    try {
        // Prepare export data
        const exportData = allEvents.map(event => {
            let codeBlock = '';
            if (event.event_category === 'ecommerce') {
                codeBlock = generateEcommerceDataLayer(event);
            } else if (event.event_category === 'datalayer') {
                codeBlock = generateCustomDataLayer(event);
            } else {
                codeBlock = generateDataLayer(event);
            }
            
            // Generate tagging plan for all event types
            const taggingPlan = generateTaggingPlan(event);
            
            return {
                image: event.image ? event.image : '',
                codeBlock: codeBlock,
                taggingPlan: taggingPlan
            };
        });
        
        const response = await fetch('/export-excel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ events: exportData })
        });
        
        if (!response.ok) {
            throw new Error('Failed to export Excel file');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `all_projects_export_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        
        alert(`✅ Successfully exported ${allEvents.length} events from ${projects.length} project(s)!`);
        
    } catch (error) {
        console.error('Export error:', error);
        alert('❌ Failed to export projects: ' + error.message);
    }
});

// Auto-save every 30 seconds if there are events
setInterval(() => {
    if (events.length > 0) {
        try {
            const progressData = {
                events: events,
                timestamp: new Date().toISOString(),
                version: '1.0',
                autoSave: true
            };
            localStorage.setItem('analyticsEventGenerator_autoSave', JSON.stringify(progressData));
        } catch (error) {
            console.warn('Auto-save failed:', error);
        }
    }
}, 30000); // 30 seconds

// Check for auto-saved data and migrate old saves on page load
function checkAutoSaveAndMigrate() {
    // Migrate old single save to new system
    try {
        const oldSaveData = localStorage.getItem('analyticsEventGenerator_progress');
        if (oldSaveData) {
            const oldProgress = JSON.parse(oldSaveData);
            if (oldProgress.events && oldProgress.events.length > 0) {
                const migratedProject = {
                    name: 'Migrated Project',
                    description: 'Automatically migrated from previous save',
                    events: oldProgress.events,
                    timestamp: oldProgress.timestamp || new Date().toISOString(),
                    version: '1.0',
                    eventCount: oldProgress.events.length
                };
                
                const existingProjects = getStoredProjects();
                existingProjects.push(migratedProject);
                localStorage.setItem('analyticsEventGenerator_projects', JSON.stringify(existingProjects));
                localStorage.removeItem('analyticsEventGenerator_progress'); // Remove old format
                
                console.log('Migrated old save data to new project system');
            }
        }
    } catch (error) {
        console.warn('Error migrating old save data:', error);
    }
    
    // Auto-save functionality is now handled by active project system
    // No need for old auto-recovery prompts
}

// Export to Excel (server-side with images)
exportButton.addEventListener('click', async () => {
    if (events.length === 0) {
        alert('No events to export!');
        return;
    }

    // Prepare export data: image, codeBlock, and taggingPlan for each event
    const exportData = events.map(event => {
        let codeBlock = '';
        if (event.event_category === 'ecommerce') {
            codeBlock = generateEcommerceDataLayer(event);
        } else if (event.event_category === 'datalayer') {
            codeBlock = generateCustomDataLayer(event);
        } else {
            codeBlock = generateDataLayer(event);
        }
        
        // Generate tagging plan for all event types
        const taggingPlan = generateTaggingPlan(event);
        
        return {
            image: event.image ? event.image : '',
            codeBlock: codeBlock,
            taggingPlan: taggingPlan
        };
    });

    try {
        const response = await fetch('/export-excel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ events: exportData })
        });
        if (!response.ok) {
            throw new Error('Failed to export Excel file');
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'analytics_events.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        alert('Error exporting Excel file: ' + err.message);
    }
});

// On page load, prefill if needed
window.addEventListener('DOMContentLoaded', () => {
    prefillScreenNameWithPrefix();
    // Also patch the form if it was already rendered
    if (screenName) {
        prefillScreenNameWithPrefix();
    }
    
    // Initialize tab from URL hash
    initializeTabFromHash();
    
    // Check for auto-saved data and migrate old saves
    setTimeout(checkAutoSaveAndMigrate, 1000); // Delay to let the page fully load
    
    // Restore active project if any
    setTimeout(restoreActiveProject, 1100); // After auto-save check
});

// Custom Event Action Dropdown logic
const customDropdown = document.getElementById('customEventActionDropdown');
const dropdownSelected = document.getElementById('dropdownSelected');
const dropdownList = document.getElementById('dropdownList');
const eventActionInput = document.getElementById('eventAction');
const dropdownOptions = customDropdown.querySelectorAll('.dropdown-option');

// Open/close dropdown
let dropdownOpen = false;
dropdownSelected.addEventListener('click', () => {
    dropdownList.style.display = dropdownOpen ? 'none' : 'block';
    dropdownOpen = !dropdownOpen;
});

// Close dropdown when clicking outside
window.addEventListener('click', (e) => {
    if (!customDropdown.contains(e.target)) {
        dropdownList.style.display = 'none';
        dropdownOpen = false;
    }
});

// Handle option selection
function selectDropdownOption(value, label) {
    eventActionInput.value = value;
    dropdownSelected.textContent = label;
    dropdownOptions.forEach(opt => opt.classList.remove('selected'));
    const selectedOpt = Array.from(dropdownOptions).find(opt => opt.dataset.value === value);
    if (selectedOpt) selectedOpt.classList.add('selected');
    dropdownList.style.display = 'none';
    dropdownOpen = false;
}
dropdownOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
        selectDropdownOption(opt.dataset.value, opt.textContent);
    });
});

// On form reset, clear dropdown
const originalResetFormDropdown = resetForm;
resetForm = function() {
    originalResetFormDropdown();
    eventActionInput.value = '';
    dropdownSelected.textContent = 'Select action';
    dropdownOptions.forEach(opt => opt.classList.remove('selected'));
}; 