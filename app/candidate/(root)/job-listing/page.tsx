import { JobList } from "@/components/candidate/job-list"

export default function Home() {
    return (
        <main className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Job Listings</h1>
            <JobList />
        </main>
    )
}

