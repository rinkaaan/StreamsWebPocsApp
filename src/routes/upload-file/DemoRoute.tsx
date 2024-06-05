import { Button, Container, ContentLayout, FileUploadProps, Form, Header, NonCancelableCustomEvent, SpaceBetween } from "@cloudscape-design/components"
import { useEffect, useState } from "react"
import { appDispatch } from "../../common/store.ts"
import { mainActions } from "../mainSlice.ts"
import BaseForm from "../../components/BaseForm.tsx"
import CloudFileUpload from "../../components/CloudFileUpload.tsx"
import axios from "axios"

const formDataAttributes = {
  "x-amz-algorithm": "AWS4-HMAC-SHA256",
  "x-amz-credential": "tsLaxHJvIOvLA5OVRw4c/20240605/us-east-1/s3/aws4_request",
  "x-amz-date": "20240605T091644Z",
  "policy": "something",
  "x-amz-signature": "something",
}

export function Component() {
  const [uploadFile, setUploadFile] = useState<File | undefined>()

  useEffect(() => {
    appDispatch(mainActions.updateSlice({ tools: undefined, toolsHidden: false }))
    return () => {
      appDispatch(mainActions.updateSlice({ toolsHidden: true }))
    }
  }, [])

  async function handleSubmit() {
    if (!uploadFile) return

    const formData = new FormData()
    formData.append("key", "presigned_testing/hello.json")
    Object.entries(formDataAttributes).forEach(([key, value]) => {
      formData.append(key, value)
    })
    formData.append("file", uploadFile)

    try {
      const response = await axios.post("https://storage-api.rinkagu.com/streams", formData)
      console.info("File uploaded successfully:", response)
    } catch (error) {
      console.error("Error uploading file:", error)
    }
  }

  function onChange({ detail }: NonCancelableCustomEvent<FileUploadProps.ChangeDetail>) {
    if (!detail.value.length) {
      setUploadFile(undefined)
      return
    } else {
      const newFile = detail.value[0]
      if (!newFile) return
      setUploadFile(newFile)
    }
  }

  return (
    <ContentLayout
      header={
        <Header variant="h1">Upload file</Header>
      }
    >
      <Form
        actions={
          <SpaceBetween
            size="xs"
            direction="horizontal"
          >
            <Button
              variant="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </SpaceBetween>
        }
      >
        <SpaceBetween size="l">
          <Container header={<Header variant="h2">Start here</Header>}>
            <BaseForm handleSubmit={handleSubmit}>
              <CloudFileUpload
                // errorText={errorMessages["pdfFile"]}
                onChange={onChange}
                value={uploadFile ? [uploadFile] : []}
                i18nStrings={{
                  uploadButtonText: e =>
                    e ? "Choose files" : "Choose file",
                  dropzoneText: e =>
                    e
                      ? "Drop files"
                      : "Drop file",
                  removeFileAriaLabel: e =>
                    `Remove file ${e + 1}`,
                  limitShowFewer: "Show fewer files",
                  limitShowMore: "Show more files",
                  errorIconAriaLabel: "Error",
                }}
                showFileSize
                showFileThumbnail
                constraintText="You can also drag and drop the file here"
                accept=".json"
              />
            </BaseForm>
          </Container>
        </SpaceBetween>
      </Form>
    </ContentLayout>
  )
}
