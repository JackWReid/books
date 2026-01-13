import { Layout } from "../components/Layout";

export function JobsPage({ jobs }) {
  return (
    <Layout title="Jobs">
      <h1>Jobs - {jobs.length}</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
              <th scope="col" className="px-6 py-3">
                Created
              </th>
              <th scope="col" className="px-6 py-3">
                Payload
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-3">{job.id}</td>
                <td className="px-6 py-3">{job.job_status}</td>
                <td className="px-6 py-3">{job.job_type}</td>
                <td className="px-6 py-3">{job.date_created}</td>
                <td className="px-6 py-3">{job.payload}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export function OldJobList({ jobs }) {
  return (
    <Layout title="Jobs">
      <h1>Jobs - {jobs.length}</h1>
      <table className="jobs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Type</th>
            <th>Created</th>
            <th>Payload</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className={`jobs-table__row--${job.job_status}`}>
              <td>{job.id}</td>
              <td>{job.job_status}</td>
              <td>{job.job_type}</td>
              <td>{job.date_created}</td>
              <td>{job.payload}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
