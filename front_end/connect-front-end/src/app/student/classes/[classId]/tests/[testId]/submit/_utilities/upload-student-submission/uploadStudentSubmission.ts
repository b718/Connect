export async function uploadStudentSubmission(
  presignedUrl: string,
  studentSubmission: File,
  testId: string
) {
  const renamedFile = new File([studentSubmission], testId + ".pdf", {
    type: studentSubmission.type,
  });
  const uploadedStudentSubmission = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/pdf",
    },
    body: renamedFile,
  });

  if (!uploadedStudentSubmission.ok) {
    throw new Error(
      `Request failed: ${uploadedStudentSubmission.status} ${uploadedStudentSubmission.statusText}. Could not parse response body.`
    );
  }

  return uploadedStudentSubmission.status;
}
