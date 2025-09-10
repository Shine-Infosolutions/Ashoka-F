import { useState, useEffect, useMemo } from "react";
import Veg from "../json/Veg.json";
import Non_veg from "../json/Non_veg.json";
import menuLimits from "../json/RatePlanLimits.json"

// Define starter categories for both Veg and Non-Veg
const STARTER_CATEGORIES = {
  "Veg": [
    "YEH_V_JARURI_HAI",
    "DESI CHEESE KE KHAZANE",
    "CHINESE_WOK_SE",
    "ITALIAN"
  ],
  "Non-Veg": [
    "DESI_CHEESE_KE_KHAZANE",
    "YEH_V_JARURI_HAI",
    "CHINESE WOK SE",
    "ITALIAN",
    "FISH SNACKS",
    "CHICKEN SNACKS",
    "MUTTON STARTERS"
  ]
};

// Water items for different food types
const WATER_ITEMS = {
  "Veg": "WATER BOTTLES",
  "Non-Veg": "WATER BOTTLES"
};

// Map category names to limit keys
const CATEGORY_LIMIT_MAP = {
  "Veg": {
    "PANEER MAIN COURSE": "MAIN COURSE-PANEER",
    "VEGETABLE MAIN COURSE": "VEGETABLES",
    "SALAD BAR": "SALAD BAR",
    "CURD AND RAITA": "CURD AND RAITA",
    "LENTILS": "MAIN COURSE - GHAR KA SWAD",
    "SOUP": "SOUP"
  },
  "Non-Veg": {
    "MAIN COURSE NON-VEG (CHICKEN)": "MAIN COURSE NON-VEG (CHICKEN)",
    "MAIN COURSE NON-VEG (MUTTON)": "MAIN COURSE NON-VEG (MUTTON)",
    "MAIN COURSE NON-VEG (FISH)": "MAIN COURSE NON-VEG (FISH)",
    "SALAD": "SALAD",
    "CURD": "CURD",
    "VEGETABLE MAIN COURSE": "VEGETABLES",
    "LENTILS": "LENTILS",
    "SOUP": "SOUP",
    "NONVEG SOUP": "NONVEG SOUP"
  }
};

// Function to get veg starter count
const getVegStarterCount = (selectedItems, menuData) => {
  const vegStarterCategories = ["SNACKS DESI CHEESE", "CHINESE WOK", "ITALIAN", "YEH_V_JARURI_HAI"];
  return selectedItems.filter(item => {
    return menuData.categories.some(cat =>
      vegStarterCategories.includes(cat.name) && cat.items.includes(item)
    );
  }).length;
};

// Function to get nonVeg starter count
const getNonVegStarterCount = (selectedItems, menuData) => {
  const nonVegStarterCategories = ["FISH SNACKS", "CHICKEN SNACKS", "MUTTON STARTERS"];
  return selectedItems.filter(item => {
    return menuData.categories.some(cat =>
      nonVegStarterCategories.includes(cat.name) && cat.items.includes(item)
    );
  }).length;
};

// Function to get paneer main course count
const getPaneerCount = (selectedItems, menuData, foodType) => {
  const paneerCategory = "PANEER MAIN COURSE";
  return selectedItems.filter(item => {
    return menuData.categories.some(cat =>
      cat.name === paneerCategory && cat.items.includes(item)
    );
  }).length;
};

// Function to get vegetable main course count
const getVegetableCount = (selectedItems, menuData, foodType) => {
  const vegetableCategory = "VEGETABLE MAIN COURSE";
  return selectedItems.filter(item => {
    return menuData.categories.some(cat =>
      cat.name === vegetableCategory && cat.items.includes(item)
    );
  }).length;
};

// Function to get chicken main course count
const getChickenMainCount = (selectedItems, menuData) => {
  return selectedItems.filter(item => {
    return menuData.categories.some(cat =>
      cat.name === "MAIN_COURSE_CHICKEN" && cat.items.includes(item)
    );
  }).length;
};

// Function to get mutton main course count
const getMuttonMainCount = (selectedItems, menuData) => {
  return selectedItems.filter(item => {
    return menuData.categories.some(cat =>
      cat.name === "MAIN_COURSE_MUTTON" && cat.items.includes(item)
    );
  }).length;
};

// Function to get fish main course count
const getFishMainCount = (selectedItems, menuData) => {
  return selectedItems.filter(item => {
    return menuData.categories.some(cat =>
      cat.name === "MAIN_COURSE_FISH_WITH_BONE" && cat.items.includes(item)
    );
  }).length;
};

// Function to get veg soup count
const getVegSoupCount = (selectedItems, menuData) => {
  return selectedItems.filter(item => {
    return menuData.categories.some(cat =>
      cat.name === "SOUP" && cat.items.includes(item)
    );
  }).length;
};

// Function to get nonveg soup count
const getNonVegSoupCount = (selectedItems, menuData) => {
  return selectedItems.filter(item => {
    return menuData.categories.some(cat =>
      cat.name === "NONVEG SOUP" && cat.items.includes(item)
    );
  }).length;
};

const MenuSelector = ({
  onSave,
  onSaveCategory,
  onClose,
  initialItems,
  foodType,
  ratePlan
}) => {
  // Detect if current user is admin
  const isAdmin = (localStorage.getItem('role') === 'Admin');

  // Mobile view detection (MUST be before any use of isMobile)
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 600 : false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const getMenuData = () => {
    return foodType === "Non-Veg" ? Non_veg : Veg;
  };

  const isRatePlanMissing = !ratePlan;
  const menuData = getMenuData();
  const [selectedItems, setSelectedItems] = useState(initialItems || []);
  const [currentCategory, setCurrentCategory] = useState(menuData.categories[0]?.name || "");

  // Get current selection limits
  const currentLimits = useMemo(() => {
    if (!ratePlan || !foodType) return {};
    return menuLimits[ratePlan]?.[foodType] || {};
  }, [ratePlan, foodType]);

  // Track category counts
  const [categoryCounts, setCategoryCounts] = useState({});

  // Track starter group count
  const starterGroupCount = useMemo(() => {
    const starterCats = STARTER_CATEGORIES[foodType] || [];
    return selectedItems.filter(item => {
      const category = menuData.categories.find(cat =>
        cat.items.includes(item) && starterCats.includes(cat.name)
      );
      return category !== undefined;
    }).length;
  }, [selectedItems, menuData, foodType]);

  // Track veg starter counts
  const vegStarterCount = useMemo(() =>
    getVegStarterCount(selectedItems, menuData),
    [selectedItems, menuData]
  );

  // Track non-veg starter counts
  const nonVegStarterCount = useMemo(() =>
    getNonVegStarterCount(selectedItems, menuData),
    [selectedItems, menuData]
  );

  // Track paneer count
  const paneerCount = useMemo(() =>
    getPaneerCount(selectedItems, menuData, foodType),
    [selectedItems, menuData, foodType]
  );

  // Track vegetable count
  const vegetableCount = useMemo(() =>
    getVegetableCount(selectedItems, menuData, foodType),
    [selectedItems, menuData, foodType]
  );

  // Track chicken main course count
  const chickenMainCount = useMemo(() =>
    getChickenMainCount(selectedItems, menuData),
    [selectedItems, menuData]
  );

  // Track mutton main course count
  const muttonMainCount = useMemo(() =>
    getMuttonMainCount(selectedItems, menuData),
    [selectedItems, menuData]
  );

  // Track fish main course count
  const fishMainCount = useMemo(() =>
    getFishMainCount(selectedItems, menuData),
    [selectedItems, menuData]
  );

  // Track veg soup count
  const vegSoupCount = useMemo(() =>
    getVegSoupCount(selectedItems, menuData),
    [selectedItems, menuData]
  );

  // Track nonveg soup count
  const nonVegSoupCount = useMemo(() =>
    getNonVegSoupCount(selectedItems, menuData),
    [selectedItems, menuData]
  );

  // Calculate non-veg main course total
  const nonVegMainCount = useMemo(() =>
    chickenMainCount + muttonMainCount + fishMainCount,
    [chickenMainCount, muttonMainCount, fishMainCount]
  );

  // Get non-veg main course limit based on plan
  const nonVegMainLimit = useMemo(() => {
    if (foodType !== "Non-Veg") return 0;
    return ratePlan === "Silver" ? 1 :
      ratePlan === "Gold" ? 2 : 3; // Platinum
  }, [foodType, ratePlan]);

  // Get veg starter limit based on plan
  const vegStarterLimit = useMemo(() => {
    return ratePlan === "Silver" ? 2 :
      ratePlan === "Gold" ? 3 : 4; // Platinum
  }, [ratePlan]);

  // Get non-veg starter limit based on plan
  const nonVegStarterLimit = useMemo(() => {
    if (foodType !== "Non-Veg") return 0;
    return ratePlan === "Silver" ? 1 :
      ratePlan === "Gold" ? 2 : 4; // Platinum
  }, [foodType, ratePlan]);

  // Count how many main course categories have at least one item selected
  const selectedMainCourseCategories = useMemo(() => {
    let count = 0;
    if (chickenMainCount > 0) count++;
    if (muttonMainCount > 0) count++;
    if (fishMainCount > 0) count++;
    return count;
  }, [chickenMainCount, muttonMainCount, fishMainCount]);

  // Add compulsory water on initial load for both Veg and Non-Veg
  useEffect(() => {
    const waterItem = WATER_ITEMS[foodType];
    if (!isRatePlanMissing && currentLimits.WATER === 1 && waterItem && !selectedItems.includes(waterItem)) {
      setSelectedItems(prev => [...prev, waterItem]);
    }
  }, [currentLimits.WATER, foodType, selectedItems, isRatePlanMissing]);

  useEffect(() => {
    // Calculate initial category counts
    const counts = {};
    menuData.categories.forEach(category => {
      counts[category.name] = category.items.filter(item =>
        selectedItems.includes(item)
      ).length;
    });
    setCategoryCounts(counts);
  }, [menuData, selectedItems]);

  // Get limit for a specific category
  const getCategoryLimit = (categoryName) => {
    if (isAdmin) return Infinity;
    // Special handling for paneer main course
    if (categoryName === "PANEER MAIN COURSE") {
      if (foodType === "Veg") {
        return currentLimits["MAIN COURSE - PANEEER"] || Infinity;
      } else {
        return 1; // Non-Veg always has limit of 1 for paneer
      }
    }

    // Check if this category has a mapped limit key
    const mappedKey = CATEGORY_LIMIT_MAP[foodType]?.[categoryName];
    const limitKey = mappedKey || categoryName;
    return currentLimits[limitKey] || Infinity;
  };

  // New function to convert flat items to category-based
  const convertToCategoryFormat = (items) => {
    // Initialize with all categories as empty arrays
    const formatted = {
      BEVERAGES: [],
      SOUP_VEG: [],
      SOUP_NON_VEG: [],
      YEH_V_JARURI_HAI: [],
      FISH_SNACKS: [],
      CHICKEN_SNACKS: [],
      MUTTON_STARTERS: [],
      DESI_CHEESE_KE_KHAZANE: [],
      CHINESE_WOK_SE: [],
      ITALIAN: [],
      SALAD_BAR: [],
      CURD_AND_RAITA: [],
      MAIN_COURSE_GHAR_KA_SWAD: [],
      VEGETABLES: [],
      MAIN_COURSE_PANEER: [],
      MAIN_COURSE_CHICKEN: [],
      MAIN_COURSE_MUTTON: [],
      MAIN_COURSE_FISH_WITH_BONE: [],
      RICE: [],
      INDIAN_BREADS: [],
      DESSERTS: [],
      ICE_CREAM: [],
      ADDITIONAL: []
    };

    // Only process if items is an array
    if (Array.isArray(items)) {
      items.forEach(item => {
        // Find which category this item belongs to
        const category = menuData.categories.find(cat =>
          cat.items.includes(item)
        );

        if (category) {
          // Convert category name to schema format
          const categoryKey = category.name
            .replace(/\s+/g, '_')
            .replace(/-/g, '_')
            .toUpperCase();

          if (formatted[categoryKey]) {
            formatted[categoryKey].push(item);
          }
        }
      });
    }

    return formatted;
  };

  // Save handler
  const handleSave = () => {
    if (isRatePlanMissing) return;

    // Ensure selectedItems is always an array
    const itemsToSave = Array.isArray(selectedItems) ? selectedItems : [];

    // Convert to categorized format
    const categorySelections = convertToCategoryFormat(itemsToSave);

    // Verify before saving
    console.log("Final categorized menu to save:", categorySelections);

    // Save to parent component
    if (onSave) {
      onSave(itemsToSave, categorySelections);
    }

    onClose();
  };

const handleSelectItem = (item, categoryName) => {
  if (isRatePlanMissing) return;

  const waterItem = WATER_ITEMS[foodType];

  // Prevent deselection of compulsory water
  if (item === waterItem && currentLimits.WATER === 1) return;

  setSelectedItems(prev => {
    const isSelected = prev.includes(item);
    let newItems;

    if (isAdmin) {
      newItems = isSelected ? prev.filter(i => i !== item) : [...prev, item];
    } else {
      // [Keep all your existing limit checks...]
      
      newItems = isSelected
        ? prev.filter(i => i !== item)
        : [...prev, item];
    }

    // Save immediately without closing
    const categorySelections = convertToCategoryFormat(newItems);
    if (onSave) onSave(newItems, categorySelections);
    if (onSaveCategory) onSaveCategory(categorySelections);

    return newItems;
  });
  

};

  // Render items with limit enforcement
  const renderCategoryItems = (category) => {
    if (isRatePlanMissing) {
      return category.items.map(item => (
        <div
          key={item}
          className="p-3 rounded-lg opacity-50 cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={false}
              onChange={() => { }}
              className="checkbox checkbox-sm"
              disabled={true}
            />
            <span>{item}</span>
          </div>
        </div>
      ));
    }

    if (isAdmin) {
      // Admin: all items enabled, no limits
      return category.items.map(item => {
        const isSelected = selectedItems.includes(item);
        return (
          <div
            key={item}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? "bg-primary text-primary-content" : "bg-base-200 hover:bg-base-300"}`}
            onClick={() => handleSelectItem(item, category.name)}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => { }}
                className="checkbox checkbox-sm checkbox-primary"
              />
              <span>{item}</span>
            </div>
          </div>
        );
      });
    }

    // Hide LIVE COUNTER for Silver
    if (ratePlan === "Silver" && category.name === "LIVE COUNTER") {
      return null;
    }

    const categoryLimit = getCategoryLimit(category.name);
    const currentCount = categoryCounts[category.name] || 0;
    const starterCats = STARTER_CATEGORIES[foodType] || [];
    const isStarterCategory = starterCats.includes(category.name);
    const starterLimit = currentLimits.STARTERS_GROUP || Infinity;
    const waterItem = WATER_ITEMS[foodType];

    // Define starter types
    const isVegStarter = ["SNACKS DESI CHEESE", "CHINESE WOK", "ITALIAN", "SNACKS_DESI_CHEESE",
      "YEH_V_JARURI_HAI",].includes(category.name);
    const isNonVegStarter = ["FISH SNACKS", "CHICKEN SNACKS", "MUTTON STARTERS"].includes(category.name);

    // Define main course types
    const isPaneerCourse = category.name === "PANEER MAIN COURSE";
    const isVegetableCourse = category.name === "VEGETABLE MAIN COURSE";
    const isChickenCourse = category.name === "MAIN_COURSE_CHICKEN";
    const isMuttonCourse = category.name === "MAIN_COURSE_MUTTON";
    const isFishCourse = category.name === "MAIN_COURSE_FISH_WITH_BONE";
    const isNonVegMainCourse = isChickenCourse || isMuttonCourse || isFishCourse;

    // Define soup types
    const isVegSoup = category.name === "SOUP";
    const isNonVegSoup = category.name === "NONVEG SOUP";

    return category.items.map(item => {
      const isSelected = selectedItems.includes(item);
      let isDisabled = false;
      let isCompulsory = false;

      // Handle compulsory water for both Veg and Non-Veg
      if (item === waterItem && currentLimits.WATER === 1) {
        isCompulsory = true;
        isDisabled = true;
      }

      if (!isSelected && !isCompulsory) {
        // Disable if individual category limit reached
        if (currentCount >= categoryLimit) {
          isDisabled = true;
        }

        // Disable if starter group limit reached
        if (isStarterCategory && starterGroupCount >= starterLimit) {
          isDisabled = true;
        }

        // Disable if veg starter limit reached
        if (isVegStarter && vegStarterCount >= vegStarterLimit) {
          isDisabled = true;
        }

        // Disable if non-veg starter limit reached for Non-Veg
        if (foodType === "Non-Veg" && isNonVegStarter && nonVegStarterCount >= nonVegStarterLimit) {
          isDisabled = true;
        }

        // Disable if non-veg main course limit reached
        if (foodType === "Non-Veg" && isNonVegMainCourse && nonVegMainCount >= nonVegMainLimit) {
          isDisabled = true;
        }

        // Disable veg soup if limit reached
        if (isVegSoup) {
          const vegSoupLimit = foodType === "Non-Veg"
            ? 1 // Non-Veg always allows 1 veg soup
            : currentLimits.SOUP || 0;

          if (vegSoupCount >= vegSoupLimit) {
            isDisabled = true;
          }
        }

        // Disable non-veg soup
        if (isNonVegSoup) {
          // Always disabled for Veg
          if (foodType === "Veg") {
            isDisabled = true;
          }
          // Disabled for Silver Non-Veg
          else if (ratePlan === "Silver") {
            isDisabled = true;
          }
          // Disabled if limit reached for Gold/Platinum Non-Veg
          else if (nonVegSoupCount >= 1) {
            isDisabled = true;
          }
        }

        // Disable mutton and fish for Silver Non-Veg
        if (ratePlan === "Silver" && foodType === "Non-Veg" &&
          (isMuttonCourse || isFishCourse)) {
          isDisabled = true;
        }
      }

      // For Gold Non-Veg, only allow 2 out of 3 main course categories
      if (
        ratePlan === "Gold" &&
        foodType === "Non-Veg" &&
        ["MAIN_COURSE_CHICKEN", "MAIN_COURSE_MUTTON", "MAIN_COURSE_FISH_WITH_BONE"].includes(category.name)
      ) {
        // If 2 categories already have selections and this one has none, disable all items in this category
        if (
          selectedMainCourseCategories >= 2 &&
          (categoryCounts[category.name] || 0) === 0
        ) {
          isDisabled = true;
        }
      }

      return (
        <div
          key={item}
          className={`p-3 rounded-lg cursor-pointer transition-colors
            ${isSelected
              ? isCompulsory
                ? "bg-secondary text-secondary-content"
                : "bg-primary text-primary-content"
              : isDisabled
                ? "bg-base-200 opacity-50 cursor-not-allowed"
                : "bg-base-200 hover:bg-base-300"
            }`}
          onClick={() => !isDisabled && handleSelectItem(item, category.name)}
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => { }}
              className={`checkbox checkbox-sm ${isCompulsory ? "checkbox-secondary" : "checkbox-primary"
                }`}
              disabled={isDisabled}
            />
            <span>
              {item}
              {isCompulsory && <span className="ml-2 text-xs text-secondary">(Compulsory)</span>}
            </span>
          </div>
        </div>
      );
    });
  };

  // Get display count for category tab
  const getCategoryDisplayCount = (category) => {
    if (isRatePlanMissing) return null;
    if (isAdmin) return "∞";
    const starterCats = STARTER_CATEGORIES[foodType] || [];
    const isStarterCategory = starterCats.includes(category.name);
    if (isStarterCategory) {
      const starterLimit = currentLimits.STARTERS_GROUP;
      if (starterLimit !== undefined) {
        return `${starterGroupCount}/${starterLimit}`;
      }
    }
    const categoryLimit = getCategoryLimit(category.name);
    if (categoryLimit !== Infinity) {
      return `${categoryCounts[category.name] || 0}/${categoryLimit}`;
    }
    return null;
  };

  // Filter categories to hide STARTERS and LIVE COUNTER for Silver
  const filteredCategories = useMemo(() => {
    return menuData.categories.filter(category => {
      // Skip STARTERS and LIVE COUNTER for Silver
      if (category.name === "STARTERS" || (ratePlan === "Silver" && category.name === "LIVE COUNTER")) {
        return false;
      }

      // Check if the category is explicitly set to false in menuLimits
      const mappedKey = CATEGORY_LIMIT_MAP[foodType]?.[category.name] || category.name;
      const limit = currentLimits[mappedKey];

      // Exclude categories where limit is explicitly false
      return limit !== false;
    });
  }, [menuData, ratePlan, foodType, currentLimits]);

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-6xl h-[92vh] flex flex-col relative shadow-2xl border border-white/20 bg-white dark:bg-base-200 !p-0 overflow-hidden">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-20 bg-white/70 hover:bg-white/90 shadow"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Main content: sidebar + content */}

        {/* Responsive: isMobile state for mobile view */}
        <div className="flex flex-1 h-full">
          {/* Sidebar: Categories (always visible, desktop style) */}
          <aside className="w-[350px] sm:w-[350px] xs:w-[170px] max-w-full bg-white/40 dark:bg-base-200/60 border-r border-white/20 flex flex-col gap-1 py-6 px-2 overflow-y-auto" style={{ width: window.innerWidth <= 600 ? 190 : 350 }}>
            <h4 className="font-bold text-lg mb-2 text-center">Categories</h4>
            {filteredCategories.map((category) => {
              const displayCount = getCategoryDisplayCount(category);
              const icons = {
                "SOUP": "🥣", "SOUP_VEG": "🥣", "SOUP_NON_VEG": "🍲", "YEH_V_JARURI_HAI": "✨", "FISH SNACKS": "🐟", "CHICKEN SNACKS": "🍗", "MUTTON STARTERS": "🥩", "DESI_CHEESE_KE_KHAZANE": "🧀", "CHINESE_WOK_SE": "🍜", "ITALIAN": "🍝", "SALAD_BAR": "🥗", "CURD_AND_RAITA": "🥛", "MAIN_COURSE_GHAR_KA_SWAD": "🍛", "VEGETABLES": "🥦", "MAIN_COURSE_PANEER": "🧀", "MAIN_COURSE_CHICKEN": "🍗", "MAIN_COURSE_MUTTON": "🥩", "MAIN_COURSE_FISH_WITH_BONE": "🐟", "RICE": "🍚", "INDIAN_BREADS": "🥖", "DESSERTS": "🍰", "ICE_CREAM": "🍦", "ADDITIONAL": "➕", "WATER BOTTLES": "💧", "LIVE COUNTER": "🔥"
              };
              const icon = icons[category.name.replace(/\s+/g, '_').toUpperCase()] || "🍽️";
              return (
                <button
                  key={category.name}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all text-left font-medium shadow-sm border border-transparent hover:bg-primary/10 focus:bg-primary/20 focus:outline-none ${currentCategory === category.name ? "bg-primary text-primary-content border-primary" : "bg-white/60 dark:bg-base-100/60"}`}
                  onClick={() => setCurrentCategory(category.name)}
                >
                  <span className="text-xl">{icon}</span>
                  <span className="flex-1 truncate">{category.name}</span>
                  {displayCount !== null && (
                    <span className="badge badge-info badge-sm font-bold">{displayCount}</span>
                  )}
                </button>
              );
            })}
          </aside>

          {/* Main content: Items */}
          <main className="flex-1 flex flex-col h-full">
            <div className="px-6 pt-8 pb-2">
              <h3 className="font-bold text-2xl text-center mb-2 tracking-tight drop-shadow">{ratePlan ? `${ratePlan} ${foodType} Menu Selection` : 'Menu Selection'}</h3>
              {isRatePlanMissing && (
                <div className="alert alert-warning mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Please select a rate plan before choosing menu items.</span>
                </div>
              )}
              {!isRatePlanMissing && STARTER_CATEGORIES[foodType]?.includes(currentCategory) && (
                <div className="text-center mb-2 text-sm text-warning">
                  <span className="font-semibold">Starter Limit:</span>
                  You can select only {currentLimits.STARTERS_GROUP || 0} items total from all starter categories
                  {foodType === "Non-Veg" ? (
                    <>
                      {ratePlan === "Silver" && <span> (Max 2 veg starters, 1 non-veg starter)</span>}
                      {ratePlan === "Gold" && <span> (Max 3 veg starters, 2 non-veg starters)</span>}
                      {ratePlan === "Platinum" && <span> (Max 4 veg starters, 4 non-veg starters)</span>}
                    </>
                  ) : (
                    <>
                      {ratePlan === "Silver" && <span> (Max 2 veg starters)</span>}
                      {ratePlan === "Gold" && <span> (Max 3 veg starters)</span>}
                      {ratePlan === "Platinum" && <span> (Max 4 veg starters)</span>}
                    </>
                  )}
                </div>
              )}
            </div>
            {/* Items grid */}
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredCategories.find((cat) => cat.name === currentCategory) &&
                  renderCategoryItems(filteredCategories.find(cat => cat.name === currentCategory))}
              </div>
            </div>
            {/* Sticky footer */}
    <footer className="sticky bottom-0 left-0 w-full bg-white/80 dark:bg-base-200/90 border-t border-white/20 px-6 py-4 flex justify-center items-center z-10 shadow-lg backdrop-blur">
  <button
    className="btn btn-ghost"
    onClick={onClose} // Only close when this button is clicked
  >
    Close Menu Selector
  </button>
</footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MenuSelector;

