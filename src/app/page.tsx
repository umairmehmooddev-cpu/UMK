import { BoundaryList } from "@/components/shell/boundary-list";
import { PageMain } from "@/components/shell/page-main";
import { featureModules } from "@/features";
import { serverBoundaries } from "@/server";

export default function HomePage() {
  return (
    <PageMain>
      <p className="text-sm font-medium text-muted">WORKBOOKOS</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Create, Deliver & Measure Interactive Workbooks.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        This deployment is the application shell. It renders on the server,
        keeps secrets out of the browser, and reserves a module for each later
        product area.
      </p>
      <p className="mt-6 text-sm text-muted">
        Registered feature modules: {featureModules.length}
      </p>
      <h2 className="mt-10 text-lg font-semibold tracking-tight">
        Server boundaries
      </h2>
      <div className="mt-4">
        <BoundaryList boundaries={serverBoundaries} />
      </div>
    </PageMain>
  );
}
