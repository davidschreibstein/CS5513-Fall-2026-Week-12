// Dynamic post page — URL shape is /posts/[id]
// Example: WordPress post ID 1 → http://localhost:3000/posts/1
import Layout from '../../components/layout'; // Shared page chrome (header, back link, etc.)
import { getAllIds, getData } from '../../lib/data'; // All post IDs + one full post by id
import utilStyles from '../../styles/utils.module.css'; // Reusable CSS module class names
import Head from 'next/head'; // Edits the document <head> (tab title, meta, etc.)
import Date from '../../components/date'; // Turns ISO dates into readable text

// React page component for "/posts/[id]".
// postData comes from getStaticProps below (WordPress post fields).
export default function Post({ postData }) {
  // WordPress returns "YYYY-MM-DD HH:MM:SS"; parseISO needs a T separator
  const dateString = postData.post_date
    ? postData.post_date.replace(' ', 'T')
    : null;

  return (
    // No home prop → Layout shows the smaller header used on non-home pages
    <Layout>
      <Head>
        {/* Browser tab title matches this post's title */}
        <title>{postData.post_title}</title>
      </Head>

      {/* Semantic wrapper for a single blog post */}
      <article>
        {/* Large post heading */}
        <h1 className={utilStyles.headingXl}>{postData.post_title}</h1>

        {/* Quieter secondary text for the publish date */}
        {dateString && (
          <div className={utilStyles.lightText}>
            <Date dateString={dateString} />
          </div>
        )}

        {/*
          Renders the WordPress post body as HTML.
          post_content already includes HTML from WP.
          dangerouslySetInnerHTML is required because React escapes HTML by default.
        */}
        <div dangerouslySetInnerHTML={{ __html: postData.post_content }} />
      </article>
    </Layout>
  );
}

// Static Generation for dynamic routes:
// tells Next.js which [id] values to pre-build (one page per WordPress post).
export async function getStaticPaths() {
  const paths = await getAllIds();
  return {
    paths,
    // false = unknown ids (not in paths) show a 404 page
    fallback: false,
  };
}

// Runs at build time once per path from getStaticPaths.
// params.id is the dynamic segment from the URL (WordPress post ID).
export async function getStaticProps({ params }) {
  const postData = await getData(params.id);

  return {
    props: {
      postData, // Becomes the postData argument on Post(...)
    },
  };
}
