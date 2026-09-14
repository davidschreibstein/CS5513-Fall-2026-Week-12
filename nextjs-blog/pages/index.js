// Home page — shown at the site root (/)
import Link from 'next/link'; // Client-side navigation between pages
import Date from '../components/date'; // Formats ISO date strings for display
import Head from 'next/head'; // Sets document <head> tags (title, meta, etc.)
import Layout, { siteTitle } from '../components/layout'; // Shared page layout + site title
import utilStyles from '../styles/utils.module.css'; // Shared utility CSS classes

// Helper that reads markdown files from /posts and returns sorted post metadata
import { getSortedPostsData } from '../lib/posts';

// Runs at build time (Static Generation).
// Fetches post data once and passes it to the page as props.
export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData, // Available to Home as a prop
    },
  };
}

// Homepage component — receives allPostsData from getStaticProps
export default function Home({ allPostsData }) {
  return (
    // home prop tells Layout to show the larger profile header
    <Layout home>
      <Head>
        {/* Browser tab title */}
        <title>{siteTitle}</title>
      </Head>

      {/* Blog post list section */}
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {/* Loop through each post and render a list item */}
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              {/* Link to the dynamic post page at /posts/[id] */}
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                {/* Formatted publish date (e.g. January 1, 2020) */}
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
