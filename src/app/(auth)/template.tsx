// Importing the React library for creating components.
import React from 'react';

// Defining the TypeScript interface for the component's props.
// This ensures that the component receives children of type React.ReactNode.
interface TemplateProps {
  children: React.ReactNode;  // The children prop allows any valid React node to be passed inside the component.
}

// The Template component definition, using React's functional component syntax.
// The component accepts a single prop: children, which it then renders within a div.
const Template: React.FC<TemplateProps> = ({ children }) => {
  // The component returns a div element that serves as a container for child components or elements.
  // The div is styled to take up the full height of the screen and to center its children both horizontally.
  return (
    <div
      className="
      h-screen // Sets the height of the div to the full height of the viewport.
      p-6 // Applies padding of 1.5rem on all sides.
      flex // Displays children using Flexbox, which helps in aligning children easily.
      justify-center" // Centers children horizontally in the flex container.
    >
        {/* // Renders the children passed to the component. This makes the component reusable for different content. */}
      {children} 
    </div>
  );
};

// Exporting the Template component as the default export of this module.
// This allows it to be imported and used in other parts of the application.
export default Template;
