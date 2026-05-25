import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <>
      <Header title="Dashboard" subtitle="Overview" />
      <div className="main-content">
        <div className="card" style={{ padding: '30px' }}>
          <h2>Welcome to ProCRM</h2>
          <p style={{ marginTop: '10px', color: 'var(--body-text-muted)' }}>
            Select an option from the sidebar to get started.
          </p>
        </div>
      </div>
    </>
  );
}
