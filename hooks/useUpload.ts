import { useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { ImageParts } from "../interfaces";
import useFilePicker from "./useFilePicker";
import { useDropArea, useAsync } from "react-use";
import bufferToDataUrl from "buffer-to-data-url";

export const useUpload = (maxFileSize: number) => {
  const [parts, setParts] = useState<ImageParts | undefined>(undefined);
  const toast = useToast();
  const [selectorFiles, openFileSelector] = useFilePicker({
    multiple: false,
    accept: [".png", ".jpeg", "webp"],
  });
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Buffer | undefined>(undefined);
  const [error, setError] = useState<string>("");

  const onFiles = useCallback(
    async (files: File[]) => {
      setLoading(true);
      try {
        const mainFile = files[0];
        const mainBuffer = await mainFile.arrayBuffer();
        const data = new FormData();
        data.append("file", mainFile);
        const resp = await fetch(`/api/util/webp`, {
          method: "POST",
          body: data,
        });
        //@ts-ignore
        const buffer = (await resp.body?.getReader().read()).value;

        const expandedData = new FormData();
        const expandedFile = new Blob([buffer!]) as File;
        console.log("file", expandedFile);
        expandedData.append("file", expandedFile);
        const expandedResp = await fetch(`/api/util/expand`, {
          method: "POST",
          body: expandedData,
        });
        const metaResp = await fetch(`/api/util/meta`, {
          method: "POST",
          body: expandedData,
        });
        const meta = (await metaResp.json()) as {
          height: number;
          width: number;
        };
        const parts = {
          buffer: Buffer.from(buffer!),
          name: mainFile.name.replace(/\..*/, ".webp"),
          dimensions: {
            height: meta.height,
            width: meta.width,
          },
        } as ImageParts;
        const expandedBuffer = (await expandedResp.body?.getReader().read())!
          .value;
        setExpanded(Buffer.from(expandedBuffer!));
        console.log({
          before: Buffer.from(mainBuffer).length,
          after: parts.buffer.length,
        });

        if (parts.buffer.length > maxFileSize) {
          toast({
            title: "File too large",
            description: `Files must be less than ${maxFileSize / 1000}kb`,
            position: "top-right",
            isClosable: true,
            status: "error",
          });
          throw Error("File too large");
        }
        setParts(parts);
        setError("");
      } catch (e) {
        console.log(e);
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [maxFileSize]
  );

  useEffect(() => {
    if (selectorFiles?.length > 0) {
      onFiles(selectorFiles);
    }
  }, [selectorFiles]);

  const [bond, state] = useDropArea({
    onFiles,
  });

  const imageFromBuffer = useAsync(async () => {
    if (!parts?.buffer) return undefined;

    return await bufferToDataUrl("image/webp", parts.buffer);
  }, [parts]);

  const expandedImageFromBuffer = useAsync(async () => {
    if (!expanded) return undefined;

    return await bufferToDataUrl("image/webp", expanded);
  }, [expanded]);

  const onRemove = () => {
    setParts(undefined);
  };

  return {
    loading,
    parts,
    openFileSelector,
    expandedImage: expandedImageFromBuffer.value,
    convertedImage: imageFromBuffer.value,
    bondDropArea: bond,
    remove: onRemove,
    error,
  } as const;
};
