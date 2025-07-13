"use client";

import PDFDownloadButton from "./PDFDownloadButton";

type Props = {
  result: any;
  token: string;
};

export default function ResultDisplay({ result, token }: Props) {
  if (!result) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Result:</h2>
      {result.error ? (
        <div className="text-red-100 bg-red-700 p-4 rounded">{result.error}</div>
      ) : (
        <>
          <pre className="bg-black p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>

          {result.pdf_path && <PDFDownloadButton filename={result.pdf_path} token={token} />}
        </>
      )}
    </div>
  );
}
