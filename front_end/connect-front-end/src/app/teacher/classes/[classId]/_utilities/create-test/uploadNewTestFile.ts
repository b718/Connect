export async function uploadNewTestFile(
  presignedUrl: string,
  testFile: File,
  testId: string
) {
  const renamedFile = new File([testFile], testId + ".pdf", {
    type: testFile.type,
  });

  const uploadNewTestFile = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/pdf",
    },
    body: renamedFile,
  });

  if (!uploadNewTestFile.ok) {
    throw new Error(
      `unable to upload test file, please try again: ${uploadNewTestFile.statusText}`
    );
  }
}
