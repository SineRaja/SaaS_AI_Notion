// Importing React from the 'react' library, which is necessary for defining React components.
import Header from '@/components/landing-page/header';
import React from 'react';

// Defining a functional component called HomePageLayout. This component is designed to be the layout wrapper
// for the content displayed on the home page of the application.
const HomePageLayout = ({ children }: { children: React.ReactNode }) => {
  // The component takes a single prop: children. This is a React pattern used to pass elements
  // from the parent component that uses HomePageLayout down into this layout's main tag.

  // Returns a JSX element, specifically a <main> tag, which is semantically appropriate for the
  // primary content of a web page. The <main> tag enhances accessibility and SEO by indicating
  // to browsers and assistive technologies that this is the main content of the page.
  return (
    <main>
            <Header />
      {/* // This injects any child components or elements passed to HomePageLayout into the element. */}
      {children}
    </main>
  );
};

// Exports HomePageLayout as the default export of this module, allowing it to be imported and used in other parts of the application.
// Default export is useful when only one component or value is being exported from a file.
export default HomePageLayout;
