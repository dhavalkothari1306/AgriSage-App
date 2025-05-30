/**
 * Data models for Smart Fertilizer Recommendation System
 */

/**
 * Crop data with nutrient requirements, growth stages, and tips
 */
const cropData = {
    'rice': {
        nutrientRequirements: {
            n: { min: 100, max: 120 },
            p: { min: 50, max: 60 },
            k: { min: 50, max: 60 }
        },
        growthStages: [
            { name: 'Seedling', description: 'Initial growth stage', days: '1-15 days' },
            { name: 'Tillering', description: 'Formation of tillers', days: '15-40 days' },
            { name: 'Panicle Initiation', description: 'Beginning of panicle formation', days: '40-60 days' },
            { name: 'Flowering', description: 'Flowering and pollination', days: '60-80 days' },
            { name: 'Maturity', description: 'Grain filling and ripening', days: '80-110 days' }
        ],
        tips: [
            'Apply basal fertilizer before transplanting',
            'Split nitrogen application into 3-4 doses',
            'Maintain proper water level during critical stages',
            'Monitor for zinc deficiency in alkaline soils'
        ]
    },
    'wheat': {
        nutrientRequirements: {
            n: { min: 120, max: 150 },
            p: { min: 60, max: 80 },
            k: { min: 40, max: 60 }
        },
        growthStages: [
            { name: 'Germination', description: 'Seed germination and emergence', days: '1-7 days' },
            { name: 'Tillering', description: 'Formation of tillers', days: '20-40 days' },
            { name: 'Stem Extension', description: 'Stem elongation', days: '40-60 days' },
            { name: 'Heading', description: 'Head emergence', days: '60-70 days' },
            { name: 'Flowering', description: 'Flowering and pollination', days: '70-80 days' },
            { name: 'Ripening', description: 'Grain filling and maturity', days: '80-120 days' }
        ],
        tips: [
            'Apply 1/3 nitrogen at sowing and remainder at tillering and heading',
            'Ensure adequate moisture at crown root initiation and flowering',
            'Monitor for yellow rust in humid conditions',
            'Apply potassium to improve lodging resistance'
        ]
    },
    'maize': {
        nutrientRequirements: {
            n: { min: 150, max: 180 },
            p: { min: 70, max: 80 },
            k: { min: 60, max: 80 }
        },
        growthStages: [
            { name: 'Germination', description: 'Seed germination and emergence', days: '1-10 days' },
            { name: 'Vegetative', description: 'Leaf development (V1-V12)', days: '10-40 days' },
            { name: 'Tasseling', description: 'Tassel emergence', days: '40-55 days' },
            { name: 'Silking', description: 'Silk emergence and pollination', days: '55-65 days' },
            { name: 'Grain Filling', description: 'Kernel development', days: '65-95 days' },
            { name: 'Maturity', description: 'Physiological maturity', days: '95-130 days' }
        ],
        tips: [
            'Apply nitrogen in split doses with higher amount at knee-high stage',
            'Ensure adequate moisture during silking and grain filling',
            'Monitor for zinc deficiency in high pH soils',
            'Apply micronutrients like zinc and boron for better yield'
        ]
    },
    'sugarcane': {
        nutrientRequirements: {
            n: { min: 250, max: 300 },
            p: { min: 80, max: 100 },
            k: { min: 120, max: 150 }
        },
        growthStages: [
            { name: 'Germination', description: 'Bud sprouting and emergence', days: '1-30 days' },
            { name: 'Tillering', description: 'Formation of tillers', days: '30-120 days' },
            { name: 'Grand Growth', description: 'Rapid stem elongation', days: '120-240 days' },
            { name: 'Maturity', description: 'Sugar accumulation', days: '240-360 days' }
        ],
        tips: [
            'Apply nitrogen in 3-4 splits throughout the growing season',
            'Ensure adequate potassium for better sugar content',
            'Apply micronutrients like zinc, iron, and manganese',
            'Maintain proper moisture during grand growth phase'
        ]
    },
    'cotton': {
        nutrientRequirements: {
            n: { min: 120, max: 150 },
            p: { min: 60, max: 80 },
            k: { min: 60, max: 80 }
        },
        growthStages: [
            { name: 'Emergence', description: 'Seedling emergence', days: '1-15 days' },
            { name: 'Vegetative', description: 'Leaf and branch development', days: '15-45 days' },
            { name: 'Squaring', description: 'Formation of flower buds', days: '45-65 days' },
            { name: 'Flowering', description: 'Flowering and boll formation', days: '65-100 days' },
            { name: 'Boll Development', description: 'Boll growth and maturation', days: '100-140 days' },
            { name: 'Maturity', description: 'Boll opening and fiber development', days: '140-180 days' }
        ],
        tips: [
            'Apply nitrogen in split doses with higher amount during squaring and flowering',
            'Ensure adequate potassium for fiber quality',
            'Monitor for magnesium deficiency in sandy soils',
            'Apply boron for proper boll development'
        ]
    },
    'potato': {
        nutrientRequirements: {
            n: { min: 120, max: 150 },
            p: { min: 100, max: 120 },
            k: { min: 150, max: 180 }
        },
        growthStages: [
            { name: 'Sprout Development', description: 'Sprout growth before planting', days: 'Pre-planting' },
            { name: 'Vegetative Growth', description: 'Leaf and branch development', days: '1-30 days' },
            { name: 'Tuber Initiation', description: 'Beginning of tuber formation', days: '30-45 days' },
            { name: 'Tuber Bulking', description: 'Enlargement of tubers', days: '45-75 days' },
            { name: 'Maturation', description: 'Completion of tuber growth', days: '75-100 days' }
        ],
        tips: [
            'Apply higher phosphorus at planting for root development',
            'Ensure adequate potassium for tuber quality and disease resistance',
            'Apply nitrogen in split doses with higher amount before tuber initiation',
            'Monitor for calcium deficiency to prevent internal browning'
        ]
    },
    'tomato': {
        nutrientRequirements: {
            n: { min: 100, max: 120 },
            p: { min: 80, max: 100 },
            k: { min: 120, max: 150 }
        },
        growthStages: [
            { name: 'Seedling', description: 'Early growth after transplanting', days: '1-20 days' },
            { name: 'Vegetative', description: 'Leaf and stem development', days: '20-40 days' },
            { name: 'Flowering', description: 'Flower formation', days: '40-55 days' },
            { name: 'Fruit Setting', description: 'Initial fruit development', days: '55-70 days' },
            { name: 'Fruit Development', description: 'Fruit enlargement', days: '70-90 days' },
            { name: 'Maturity', description: 'Fruit ripening', days: '90-120 days' }
        ],
        tips: [
            'Apply higher phosphorus at transplanting for root development',
            'Ensure adequate calcium to prevent blossom end rot',
            'Apply potassium for fruit quality and color development',
            'Monitor for magnesium deficiency in acidic soils'
        ]
    }
};

/**
 * Fertilizer data with composition, cost, and description
 */
const fertilizerData = {
    'urea': {
        composition: 'N: 46%, P: 0%, K: 0%',
        nutrientContent: { n: 46, p: 0, k: 0 },
        cost: 6.5, // Cost per kg in INR
        description: 'High nitrogen fertilizer suitable for most crops. Quick-acting but can leach in heavy rainfall.'
    },
    'dap': {
        composition: 'N: 18%, P: 46%, K: 0%',
        nutrientContent: { n: 18, p: 46, k: 0 },
        cost: 24, // Cost per kg in INR
        description: 'Diammonium Phosphate provides both nitrogen and phosphorus. Good as a starter fertilizer.'
    },
    'mop': {
        composition: 'N: 0%, P: 0%, K: 60%',
        nutrientContent: { n: 0, p: 0, k: 60 },
        cost: 17, // Cost per kg in INR
        description: 'Muriate of Potash is a high potassium fertilizer. Improves crop quality and disease resistance.'
    },
    'npk_complex': {
        composition: 'N: 10%, P: 26%, K: 26%',
        nutrientContent: { n: 10, p: 26, k: 26 },
        cost: 23, // Cost per kg in INR
        description: 'Balanced fertilizer providing all three major nutrients. Good for basal application.'
    },
    'ssp': {
        composition: 'N: 0%, P: 16%, K: 0%',
        nutrientContent: { n: 0, p: 16, k: 0 },
        cost: 8, // Cost per kg in INR
        description: 'Single Super Phosphate provides phosphorus along with sulfur and calcium. Good for oilseeds and pulses.'
    },
    'can': {
        composition: 'N: 25%, P: 0%, K: 0%',
        nutrientContent: { n: 25, p: 0, k: 0 },
        cost: 13, // Cost per kg in INR
        description: 'Calcium Ammonium Nitrate provides nitrogen along with calcium. Less acidifying than urea.'
    }
};

/**
 * Educational tips for different soil conditions and management practices
 */
const educationalTips = {
    acidicSoil: [
        'Apply agricultural lime to raise soil pH',
        'Use less acidifying nitrogen fertilizers like CAN instead of urea',
        'Consider acid-tolerant crops like potato, rice, or tea',
        'Apply fertilizers in split doses to reduce leaching'
    ],
    alkalineSoil: [
        'Apply gypsum or elemental sulfur to reduce soil pH',
        'Monitor for micronutrient deficiencies, especially zinc, iron, and manganese',
        'Use acidifying fertilizers like ammonium sulfate',
        'Add organic matter to improve soil structure and nutrient availability'
    ],
    lowOrganicMatter: [
        'Incorporate crop residues into the soil',
        'Apply well-decomposed farmyard manure or compost',
        'Practice crop rotation with legumes',
        'Consider green manuring with crops like sunhemp or dhaincha'
    ],
    waterManagement: [
        'Practice irrigation scheduling based on crop water requirements',
        'Consider drip irrigation for efficient water use',
        'Apply mulch to reduce evaporation losses',
        'Maintain proper drainage to prevent waterlogging'
    ],
    integratedNutrientManagement: [
        'Combine organic and inorganic fertilizers for balanced nutrition',
        'Use biofertilizers like Rhizobium, Azotobacter, or PSB',
        'Practice crop rotation to maintain soil fertility',
        'Conduct regular soil testing to monitor nutrient levels'
    ]
};

/**
 * Weather impact on fertilizer application
 */
const weatherImpact = {
    rain: {
        heavy: {
            suitable: false,
            recommendation: 'Avoid fertilizer application during heavy rain as it can cause leaching and runoff losses.'
        },
        moderate: {
            suitable: true,
            recommendation: 'Moderate rainfall after fertilizer application can help in nutrient absorption.'
        },
        light: {
            suitable: true,
            recommendation: 'Light rainfall is ideal for fertilizer application as it helps in nutrient dissolution.'
        },
        none: {
            suitable: true,
            recommendation: 'Apply fertilizer followed by irrigation for better nutrient uptake.'
        }
    },
    temperature: {
        high: {
            suitable: false,
            recommendation: 'High temperatures can cause volatilization losses of nitrogen. Apply in the evening or early morning.'
        },
        moderate: {
            suitable: true,
            recommendation: 'Moderate temperatures are ideal for fertilizer application and nutrient uptake.'
        },
        low: {
            suitable: false,
            recommendation: 'Low temperatures reduce microbial activity and nutrient uptake. Consider slow-release fertilizers.'
        }
    },
    humidity: {
        high: {
            suitable: true,
            recommendation: 'High humidity reduces volatilization losses but may increase disease pressure.'
        },
        moderate: {
            suitable: true,
            recommendation: 'Moderate humidity is ideal for fertilizer application.'
        },
        low: {
            suitable: false,
            recommendation: 'Low humidity can increase volatilization losses. Apply fertilizer in the evening or early morning.'
        }
    }
};

/**
 * Regional adjustments for NPK ratios based on soil characteristics
 */
const regionalAdjustments = {
    'north_india': {
        n: 1.1, // 10% increase in nitrogen
        p: 1.0,
        k: 0.9  // 10% decrease in potassium
    },
    'south_india': {
        n: 0.9, // 10% decrease in nitrogen
        p: 1.0,
        k: 1.1  // 10% increase in potassium
    },
    'east_india': {
        n: 1.0,
        p: 1.1, // 10% increase in phosphorus
        k: 1.0
    },
    'west_india': {
        n: 1.0,
        p: 0.9, // 10% decrease in phosphorus
        k: 1.1  // 10% increase in potassium
    },
    'central_india': {
        n: 1.0,
        p: 1.0,
        k: 1.0  // No adjustment
    },
    'northeast_india': {
        n: 0.9, // 10% decrease in nitrogen
        p: 1.1, // 10% increase in phosphorus
        k: 1.0
    }
};