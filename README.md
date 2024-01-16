# WikiWyg

#### Author, Edit, and Publish informational articles with ease. Wikiwyg is an wysiwyg editor for creating and editing articles.

#### It is full stack application. The tech stack is as follows:

- Frontend built with **Next** 13's new App router and SSR capabilities.
- **Next API** routes are used to handle all requests.
- The editor is built using a **Quill.js** base, tweaked to include custom features like references.
- **MongoDB** Atlas is the database of choice.
- The application is deployed on **Vercel**.

Live demo: [WikiWyg](https://wysiwyg-sage.vercel.app/)

## Features

### Full Authentication Module

> Users can register, login, and logout

### Article Viewing

> Site visitors can read all saved articles

### Article Authoring

> Authenticated Users can create new articles and publish them

### Article Editing

> Authenticated Users can edit any article on the site

### Edit History

> Edit timelines are saved and can be accessed by clicking the history button on any article

### Article References

> Articles can have references to other articles. The custom `[C]` button in the editors formats a new reference superscript and adds it to the references section at the bottom of the article. The reference is also added to the article's references list.

## Design

### Why Next?

> Next offers a powerful router and its SSR capabilities greatly benefit SEO. Additionally, Next provides a convenient API routes feature, making it straightforward to develop a backend. One of the advantages of Next is its scalability; when the need arises, the API routes can be easily moved to an external Node server.

### Why Quill?

> Quill is a powerful open source editor with a rich feature set that is highly customizable. The editor is also well documented and has a large community.

### Why MongoDB Atlas?

> MongoDB Atlas is a fully managed cloud database service. It is easy to set up and use, and is highly scalable and reliable.

## Challenges

Quill js is a powerful editor, but its API has proven to be overegineered when it comes to fully custom editor features, which is why the footnotes features took considerable effort to develop. Moreover, due to its reliability on the DOM, Quill is not SSR friendly and thus has was tricky to integrate with Next.

## Potential Featurs Improvements

1. Non-URL Footnotes: Implement a feature that allows users to add footnotes that aren't necessarily URLs. This could provide more context or additional information about the article.

2. Source Validation Mechanism: Implement a mechanism to validate the sources or references in the articles. This could help maintain the credibility and reliability of the information in the articles.

3. Third-Party Authentication: Integrate third-party authentication providers like Google, Facebook, or Twitter. This could simplify the registration and login process for users.

4. Image Improvements:

    - Alignment: Allow users to align images to the left, right, or center.
    - Drag to Move: Implement a feature that allows users to move images within the article by dragging and dropping.
    - Drag to Resize: Allow users to resize images by dragging the corners.
    - Drag and Drop: Implement a feature that allows users to add images to the article by dragging and dropping.

5. Importing Articles from Similar Sites: Implement a feature that allows users to import articles from similar sites. This could help users to quickly populate their account with their favorite articles.

6. Use Article Slug, Not ID for URL: Use the article's title (slugified) instead of its ID in the URL. This could improve SEO and make URLs more human-readable.

7. Explore Articles Relevant to User: Implement a recommendation system that suggests articles based on the user's reading history or preferences.

6. Explore Articles Relevant to Article: On each article page, show a list of related articles. This could help users discover more content that they're interested in.








