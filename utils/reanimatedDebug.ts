// Debug utility to track Reanimated value access during render
export const trackReanimatedAccess = (componentName: string, action: string) => {
  console.log(`[Reanimated Debug] ${componentName} - ${action}`);
  console.trace();
};

// Wrapper for shared value creation
export const debugSharedValue = <T>(initialValue: T, componentName: string) => {
  console.log(`[Reanimated Debug] Creating shared value in ${componentName}`);
  return {
    value: initialValue,
    // Track access
    get() {
      trackReanimatedAccess(componentName, 'Reading value during render');
      return this.value;
    },
    set(newValue: T) {
      trackReanimatedAccess(componentName, 'Writing value during render');
      this.value = newValue;
    }
  };
};