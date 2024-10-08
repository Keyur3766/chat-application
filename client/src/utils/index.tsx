// A utility function to concatenate CSS class names with proper spacing
export const classNames = (...className: string[]) => {
    // Filter out any empty class names and join them with a space
    return className.filter(Boolean).join(" ");
};