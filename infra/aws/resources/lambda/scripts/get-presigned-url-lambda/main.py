import json
import logging
import boto3

s3_client = boto3.client("s3")
logger = logging.getLogger()
logger.setLevel("INFO")

BUCKET_NAME = "connect-tests-bucket"

def get_answer_key_presigned_url(class_id: str, teacher_id: str, test_id: str) -> str:
    return f"class/{class_id}/teacher/{teacher_id}/{test_id}.pdf"

def get_student_submission_presigned_url(class_id: str, student_id: str, test_id: str) -> str:
    return f"class/{class_id}/student/{student_id}/{test_id}.pdf"
    
def get_presigned_url_to_fetch_from_s3(student_id: str, teacher_id: str, class_id: str, test_id: str) -> str:
    EXPIRY_TIME = 300

    try:
        if not student_id:
            return s3_client.generate_presigned_url(
                "get_object",
                Params={
                    "Bucket": BUCKET_NAME,
                    "Key": get_answer_key_presigned_url(class_id, teacher_id, test_id),
                },
                ExpiresIn=EXPIRY_TIME
            )
        else:
            return s3_client.generate_presigned_url(
                "get_object",
                Params={
                    "Bucket": BUCKET_NAME,
                    "Key": get_student_submission_presigned_url(class_id, student_id, test_id),
                },
                ExpiresIn=EXPIRY_TIME
            )
    except Exception as e:
        logger.error(f"encountered error while trying to generate presigned url: {e.message}")
        raise e

def lambda_handler(event, context):
    STUDENT_ID_KEY, TEACHER_ID_KEY, CLASS_ID_KEY, TEST_ID = "studentId", "teacherId", "classId", "testId"
    event = json.loads(event["body"])
    logger.info(f"current event: {event}")

    student_id = event[STUDENT_ID_KEY] if STUDENT_ID_KEY in event else None
    teacher_id = event[TEACHER_ID_KEY] if TEACHER_ID_KEY in event else None
    class_id = event[CLASS_ID_KEY]
    test_id = event[TEST_ID]

    try:
        presigned_url = get_presigned_url_to_fetch_from_s3(student_id, teacher_id, class_id, test_id)
    except Exception:
        logger.error(f"failed to generate presigned url to fetch object from s3")
        return {
            "statusCode": 400,
            "body": {
                "presignedUrl": "ERROR"
            }
        }
    
    logger.info(f"successfully generated presigned url to fetch object from s3")
    return {
        "statusCode": 200,
        "body": {
            "presignedUrl": presigned_url
        }
    }