import { useState } from "react";
import { useWorkspace } from "../hooks/useWorkspace";
import Button from "../../../components/ui/button/Button";

export default function BusinessOnboardingPage() {
  const { createBusiness, isLoading: workspaceLoading, businesses, error: workspaceError } = useWorkspace();

  const [name, setName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [taxIdentifier, setTaxIdentifier] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayError = workspaceError || error;

  const isRedirectPending = businesses.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Le nom commercial est requis.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createBusiness({
        name: name.trim(),
        legalName: legalName.trim() || undefined,
        taxIdentifier: taxIdentifier.trim() || undefined,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la création de l'entreprise.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = submitting || workspaceLoading || isRedirectPending;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800 sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white/90">
              Créez votre entreprise
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Commencez par configurer votre espace de travail. Vous pourrez
              modifier ces informations plus tard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="business-name"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nom commercial <span className="text-red-500">*</span>
              </label>
              <input
                id="business-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Café El Médina"
                required
                disabled={disabled}
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:placeholder-gray-500 dark:focus:border-brand-400"
              />
            </div>

            <div>
              <label
                htmlFor="business-legal-name"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nom légal
              </label>
              <input
                id="business-legal-name"
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="Ex: SARL El Médina"
                disabled={disabled}
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:placeholder-gray-500 dark:focus:border-brand-400"
              />
            </div>

            <div>
              <label
                htmlFor="business-tax-id"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Matricule fiscal
              </label>
              <input
                id="business-tax-id"
                type="text"
                value={taxIdentifier}
                onChange={(e) => setTaxIdentifier(e.target.value)}
                placeholder="Ex: 1234567X/A/M/000"
                disabled={disabled}
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:placeholder-gray-500 dark:focus:border-brand-400"
              />
            </div>

            {displayError && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                {displayError}
              </div>
            )}

            <Button
              type="submit"
              disabled={disabled}
              className="w-full"
            >
              {submitting ? "Création en cours…" : "Créer mon entreprise"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
            En créant votre entreprise, vous acceptez les conditions
            d'utilisation.
          </p>
        </div>
      </div>
    </div>
  );
}
