import Layout from '../components/Layout';

export default function HomePage() {
  return <Layout />;
}

export function getServerSideProps({ res }) {
  res.writeHead(301, {
    Location: '/my-view'
  });
  res.end();

  return { props: {} };
}
