/**
 * Recommendation Engine for Smart Fertilizer Recommendation System
 */

class RecommendationEngine {
    constructor() {
        this.cropType = null;
        this.soilData = null;
        this.weatherAnalysis = null;
        this.region = null;
    }
    
    /**
     * Set soil data for recommendation
     * @param {Object} soilData - Soil data object
     */
    setSoilData(soilData) {
        this.soilData = soilData;
    }
    
    /**
     * Set crop type for recommendation
     * @param {string} cropType - Crop type
     */
    setCropType(cropType) {
        this.cropType = cropType;
    }
    
    /**
     * Set weather analysis for recommendation
     * @param {Object} weatherAnalysis - Weather analysis object
     */
    setWeatherAnalysis(weatherAnalysis) {
        this.weatherAnalysis = weatherAnalysis;
    }
    
    /**
     * Set region for recommendation
     * @param {string} region - Region
     */
    setRegion(region) {
        this.region = region;
    }
    
    /**
     * Generate fertilizer recommendation
     * @returns {Object} - Recommendation object
     */
    generateRecommendation() {
        if (!this.cropType || !this.soilData) {
            return null;
        }
        
        // Get crop nutrient requirements
        const crop = cropData[this.cropType];
        if (!crop) return null;
        
        // Calculate nutrient deficiencies
        const deficiencies = this.calculateNutrientDeficiencies(crop.nutrientRequirements);
        
        // Apply regional adjustments if available
        if (this.region && regionalAdjustments[this.region]) {
            const adjustments = regionalAdjustments[this.region];
            deficiencies.n *= adjustments.n;
            deficiencies.p *= adjustments.p;
            deficiencies.k *= adjustments.k;
        }
        
        // Determine fertilizer quantities
        const fertilizerPlan = this.determineFertilizerQuantities(deficiencies);
        
        // Generate application schedule
        const applicationSchedule = this.generateApplicationSchedule(fertilizerPlan, crop.growthStages);
        
        // Calculate costs
        const costBreakdown = this.calculateCosts(fertilizerPlan);
        
        // Generate educational tips
        const educationalTips = this.generateEducationalTips();
        
        // Predict yield improvement
        const yieldPrediction = this.predictYieldImprovement();
        
        return {
            fertilizerPlan,
            applicationSchedule,
            costBreakdown,
            educationalTips,
            yieldPrediction
        };
    }
    
    /**
     * Calculate nutrient deficiencies based on soil test and crop requirements
     * @param {Object} cropRequirements - Crop nutrient requirements
     * @returns {Object} - Nutrient deficiencies
     */
    calculateNutrientDeficiencies(cropRequirements) {
        // Calculate average requirement for each nutrient
        const avgN = (cropRequirements.n.min + cropRequirements.n.max) / 2;
        const avgP = (cropRequirements.p.min + cropRequirements.p.max) / 2;
        const avgK = (cropRequirements.k.min + cropRequirements.k.max) / 2;
        
        // Calculate deficiencies (requirement - soil level)
        const nDeficiency = Math.max(0, avgN - this.soilData.n);
        const pDeficiency = Math.max(0, avgP - this.soilData.p);
        const kDeficiency = Math.max(0, avgK - this.soilData.k);
        
        // Adjust based on soil pH
        let phAdjustment = 1.0;
        if (this.soilData.ph < 5.5) {
            // In acidic soils, phosphorus availability decreases
            phAdjustment = 1.2; // Increase P recommendation by 20%
        } else if (this.soilData.ph > 7.5) {
            // In alkaline soils, micronutrient availability decreases
            phAdjustment = 1.1; // Increase overall recommendation by 10%
        }
        
        // Adjust based on organic matter
        let omAdjustment = 1.0;
        if (this.soilData.organicMatter < 0.5) {
            // Low organic matter means lower nutrient retention
            omAdjustment = 1.15; // Increase recommendation by 15%
        } else if (this.soilData.organicMatter > 3.0) {
            // High organic matter means better nutrient availability
            omAdjustment = 0.9; // Decrease recommendation by 10%
        }
        
        // Apply adjustments
        return {
            n: nDeficiency * phAdjustment * omAdjustment,
            p: pDeficiency * phAdjustment * omAdjustment,
            k: kDeficiency * phAdjustment * omAdjustment
        };
    }
    
    /**
     * Determine fertilizer quantities based on nutrient deficiencies
     * @param {Object} deficiencies - Nutrient deficiencies
     * @returns {Array} - Fertilizer plan
     */
    determineFertilizerQuantities(deficiencies) {
        const fertilizerPlan = [];
        let remainingN = deficiencies.n;
        let remainingP = deficiencies.p;
        let remainingK = deficiencies.k;
        
        // First, add complex fertilizer to provide balanced nutrition
        if (remainingP > 0 && remainingK > 0) {
            const npkComplex = fertilizerData['npk_complex'];
            // Calculate quantity based on P or K, whichever requires less fertilizer
            const quantityBasedOnP = remainingP / (npkComplex.nutrientContent.p / 100);
            const quantityBasedOnK = remainingK / (npkComplex.nutrientContent.k / 100);
            const quantity = Math.min(quantityBasedOnP, quantityBasedOnK);
            
            if (quantity > 0) {
                const nProvided = quantity * (npkComplex.nutrientContent.n / 100);
                const pProvided = quantity * (npkComplex.nutrientContent.p / 100);
                const kProvided = quantity * (npkComplex.nutrientContent.k / 100);
                
                fertilizerPlan.push({
                    name: 'NPK Complex (10:26:26)',
                    quantity: quantity,
                    composition: npkComplex.composition,
                    description: npkComplex.description,
                    nutrientProvided: {
                        n: nProvided,
                        p: pProvided,
                        k: kProvided
                    }
                });
                
                remainingN -= nProvided;
                remainingP -= pProvided;
                remainingK -= kProvided;
            }
        }
        
        // Add DAP for remaining phosphorus
        if (remainingP > 0) {
            const dap = fertilizerData['dap'];
            const quantity = remainingP / (dap.nutrientContent.p / 100);
            
            if (quantity > 0) {
                const nProvided = quantity * (dap.nutrientContent.n / 100);
                const pProvided = quantity * (dap.nutrientContent.p / 100);
                
                fertilizerPlan.push({
                    name: 'DAP (18:46:0)',
                    quantity: quantity,
                    composition: dap.composition,
                    description: dap.description,
                    nutrientProvided: {
                        n: nProvided,
                        p: pProvided,
                        k: 0
                    }
                });
                
                remainingN -= nProvided;
                remainingP -= pProvided;
            }
        }
        
        // Add MOP for remaining potassium
        if (remainingK > 0) {
            const mop = fertilizerData['mop'];
            const quantity = remainingK / (mop.nutrientContent.k / 100);
            
            if (quantity > 0) {
                const kProvided = quantity * (mop.nutrientContent.k / 100);
                
                fertilizerPlan.push({
                    name: 'MOP (0:0:60)',
                    quantity: quantity,
                    composition: mop.composition,
                    description: mop.description,
                    nutrientProvided: {
                        n: 0,
                        p: 0,
                        k: kProvided
                    }
                });
                
                remainingK -= kProvided;
            }
        }
        
        // Add Urea for remaining nitrogen
        if (remainingN > 0) {
            const urea = fertilizerData['urea'];
            const quantity = remainingN / (urea.nutrientContent.n / 100);
            
            if (quantity > 0) {
                const nProvided = quantity * (urea.nutrientContent.n / 100);
                
                fertilizerPlan.push({
                    name: 'Urea (46:0:0)',
                    quantity: quantity,
                    composition: urea.composition,
                    description: urea.description,
                    nutrientProvided: {
                        n: nProvided,
                        p: 0,
                        k: 0
                    }
                });
                
                remainingN -= nProvided;
            }
        }
        
        return fertilizerPlan;
    }
    
    /**
     * Generate application schedule based on crop growth stages
     * @param {Array} fertilizerPlan - Fertilizer plan
     * @param {Array} growthStages - Crop growth stages
     * @returns {Array} - Application schedule
     */
    generateApplicationSchedule(fertilizerPlan, growthStages) {
        if (!fertilizerPlan || fertilizerPlan.length === 0 || !growthStages || growthStages.length === 0) {
            return [];
        }
        
        const schedule = [];
        
        // Define application stages (simplified)
        const applicationStages = [
            {
                name: 'Basal Application',
                stage: growthStages[0], // First growth stage
                fertilizers: ['DAP (18:46:0)', 'MOP (0:0:60)', 'NPK Complex (10:26:26)'],
                percentages: { 'DAP (18:46:0)': 100, 'MOP (0:0:60)': 50, 'NPK Complex (10:26:26)': 50, 'Urea (46:0:0)': 20 },
                method: 'Incorporate into soil before planting/transplanting'
            },
            {
                name: 'Vegetative Stage',
                stage: growthStages.length > 1 ? growthStages[1] : null, // Second growth stage if available
                fertilizers: ['Urea (46:0:0)', 'NPK Complex (10:26:26)'],
                percentages: { 'Urea (46:0:0)': 40, 'NPK Complex (10:26:26)': 30, 'MOP (0:0:60)': 25 },
                method: 'Side dressing or top dressing'
            },
            {
                name: 'Reproductive Stage',
                stage: growthStages.length > 2 ? growthStages[2] : null, // Third growth stage if available
                fertilizers: ['Urea (46:0:0)', 'MOP (0:0:60)', 'NPK Complex (10:26:26)'],
                percentages: { 'Urea (46:0:0)': 40, 'MOP (0:0:60)': 25, 'NPK Complex (10:26:26)': 20 },
                method: 'Foliar spray or side dressing'
            }
        ];
        
        // Create schedule for each application stage
        applicationStages.forEach(appStage => {
            if (!appStage.stage) return; // Skip if no growth stage is available
            
            const stageFertilizers = [];
            
            // Allocate fertilizers for this stage
            fertilizerPlan.forEach(fert => {
                if (appStage.fertilizers.includes(fert.name)) {
                    const percentage = appStage.percentages[fert.name] || 0;
                    if (percentage > 0) {
                        const quantity = (fert.quantity * percentage) / 100;
                        stageFertilizers.push({
                            name: fert.name,
                            quantity: Math.round(quantity * 10) / 10, // Round to 1 decimal place
                            method: appStage.method
                        });
                    }
                }
            });
            
            if (stageFertilizers.length > 0) {
                schedule.push({
                    stageName: appStage.name,
                    stageDescription: `${appStage.stage.name} (${appStage.stage.days})`,
                    fertilizers: stageFertilizers
                });
            }
        });
        
        return schedule;
    }
    
    /**
     * Calculate costs of fertilizer plan
     * @param {Array} fertilizerPlan - Fertilizer plan
     * @returns {Object} - Cost breakdown
     */
    calculateCosts(fertilizerPlan) {
        if (!fertilizerPlan || fertilizerPlan.length === 0) {
            return null;
        }
        
        let totalCost = 0;
        const details = [];
        
        fertilizerPlan.forEach(fert => {
            let unitCost = 0;
            
            // Get unit cost from fertilizer data
            switch (fert.name) {
                case 'Urea (46:0:0)':
                    unitCost = fertilizerData['urea'].cost;
                    break;
                case 'DAP (18:46:0)':
                    unitCost = fertilizerData['dap'].cost;
                    break;
                case 'MOP (0:0:60)':
                    unitCost = fertilizerData['mop'].cost;
                    break;
                case 'NPK Complex (10:26:26)':
                    unitCost = fertilizerData['npk_complex'].cost;
                    break;
                case 'SSP (0:16:0)':
                    unitCost = fertilizerData['ssp'].cost;
                    break;
                case 'CAN (25:0:0)':
                    unitCost = fertilizerData['can'].cost;
                    break;
                default:
                    unitCost = 0;
            }
            
            const itemCost = fert.quantity * unitCost;
            totalCost += itemCost;
            
            details.push({
                name: fert.name,
                quantity: fert.quantity,
                unitCost: unitCost,
                totalCost: itemCost
            });
        });
        
        return {
            totalCost: totalCost,
            costPerHectare: totalCost, // Already per hectare
            details: details
        };
    }
    
    /**
     * Generate educational tips based on soil, crop, and weather
     * @returns {Array} - Educational tips
     */
    generateEducationalTips() {
        const tips = [];
        
        // Add soil-specific tips
        if (this.soilData) {
            if (this.soilData.ph < 6.0) {
                // Acidic soil
                tips.push(...educationalTips.acidicSoil.slice(0, 2));
            } else if (this.soilData.ph > 7.5) {
                // Alkaline soil
                tips.push(...educationalTips.alkalineSoil.slice(0, 2));
            }
            
            if (this.soilData.organicMatter < 0.5) {
                // Low organic matter
                tips.push(...educationalTips.lowOrganicMatter.slice(0, 2));
            }
        }
        
        // Add crop-specific tips
        if (this.cropType && cropData[this.cropType]) {
            tips.push(...cropData[this.cropType].tips.slice(0, 2));
        }
        
        // Add weather-specific tips
        if (this.weatherAnalysis) {
            tips.push(this.weatherAnalysis.recommendations.temperature);
            tips.push(this.weatherAnalysis.recommendations.humidity);
        }
        
        // Add general tips on integrated nutrient management
        tips.push(...educationalTips.integratedNutrientManagement.slice(0, 2));
        
        // Add water management tips
        tips.push(...educationalTips.waterManagement.slice(0, 1));
        
        // Limit to 5 tips to avoid overwhelming the user
        return tips.slice(0, 5);
    }
    
    /**
     * Predict yield improvement based on fertilizer recommendation
     * @returns {Object} - Yield prediction
     */
    predictYieldImprovement() {
        if (!this.cropType || !this.soilData) {
            return null;
        }
        
        // Base yield improvement percentage
        let baseImprovement = 15; // 15% improvement with optimal fertilization
        
        // Factors affecting yield improvement
        const soilHealthFactor = this.calculateSoilHealthFactor();
        const weatherFactor = this.calculateWeatherFactor();
        const fertilizationFactor = 10; // Assuming optimal fertilization from our recommendation
        
        // Calculate total predicted improvement
        const totalImprovement = soilHealthFactor + weatherFactor + fertilizationFactor;
        
        // Base yield depends on crop (simplified model)
        let baseYield = 'Average';
        switch (this.cropType) {
            case 'rice':
                baseYield = '4-5 tons/ha';
                break;
            case 'wheat':
                baseYield = '3-4 tons/ha';
                break;
            case 'maize':
                baseYield = '5-6 tons/ha';
                break;
            case 'sugarcane':
                baseYield = '70-80 tons/ha';
                break;
            case 'cotton':
                baseYield = '2-3 tons/ha';
                break;
            case 'potato':
                baseYield = '20-25 tons/ha';
                break;
            case 'tomato':
                baseYield = '25-30 tons/ha';
                break;
            default:
                baseYield = 'Average for crop';
        }
        
        return {
            baseYield: baseYield,
            predictedImprovement: Math.round(totalImprovement),
            factors: {
                soilHealth: soilHealthFactor,
                weather: weatherFactor,
                fertilization: fertilizationFactor
            }
        };
    }
    
    /**
     * Calculate soil health factor for yield prediction
     * @returns {number} - Soil health factor
     */
    calculateSoilHealthFactor() {
        if (!this.soilData) return 0;
        
        let factor = 0;
        
        // pH factor
        const optimalPH = 6.5;
        const phDifference = Math.abs(this.soilData.ph - optimalPH);
        if (phDifference < 0.5) {
            factor += 5; // Optimal pH
        } else if (phDifference < 1.0) {
            factor += 3; // Slightly off optimal
        } else {
            factor += 1; // Far from optimal
        }
        
        // Organic matter factor
        if (this.soilData.organicMatter > 3.0) {
            factor += 5; // High organic matter
        } else if (this.soilData.organicMatter > 1.0) {
            factor += 3; // Medium organic matter
        } else {
            factor += 1; // Low organic matter
        }
        
        return factor;
    }
    
    /**
     * Calculate weather factor for yield prediction
     * @returns {number} - Weather factor
     */
    calculateWeatherFactor() {
        if (!this.weatherAnalysis) return 5; // Default value if no weather data
        
        return this.weatherAnalysis.isSuitable ? 8 : 3;
    }
}

// Create a global instance of the recommendation engine
const recommendationEngine = new RecommendationEngine();