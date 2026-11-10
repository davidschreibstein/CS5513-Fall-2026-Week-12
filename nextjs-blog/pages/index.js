// Home page — rendered at the site root URL (/)
import Link from 'next/link'; // Client-side links (no full page reload)
import Head from 'next/head'; // Edits the document <head> (tab title, meta, etc.)
import Layout, { siteTitle } from '../components/layout'; // Shared layout + exported site title string
import utilStyles from '../styles/utils.module.css'; // Reusable CSS module class names

// Fetches latest posts from the WordPress REST endpoint
import { getSortedList } from '../lib/data';

// Static Generation: runs once at build time on the server (not in the browser).
// Whatever you return in props is passed into the page component below.
export async function getStaticProps() {
  const allPostsData = await getSortedList(); // Array of { id, name }
  return {
    props: {
      allPostsData, // Becomes the allPostsData argument on Home(...)
    },
  };
}

// React page component for "/".
// allPostsData comes from getStaticProps above.
export default function Home({ allPostsData }) {
  return (
    // home={true} → Layout shows the large homepage header (bigger photo + name)
    <Layout home>
      <Head>
        {/* Text shown in the browser tab */}
        <title>{siteTitle}</title>
      </Head>

      {/* Blog listing: heading + unordered list of posts */}
      {/* Template literal combines two CSS module classes into one className string */}
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {/* .map() builds one <li> per post; destructure only the fields we need */}
          {allPostsData.map(({ id, name }) => (
            // key helps React track each list item; use a stable unique value (id)
            <li className={utilStyles.listItem} key={id}>
              {/* Dynamic route: /posts/1, /posts/2, etc. */}
              <Link href={`/posts/${id}`}>{name}</Link>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
