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
      "unable to upload student submission, please try again thanks"
    );
  }

  return uploadedStudentSubmission.status;
}
