export default function FileUploader({onFileChange}: { onFileChange: (file: File) => void }) {
    return (
        <input
            type="file"
            onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) onFileChange(selected);
                // selecting same file will trigger button
                e.target.value = "";
            }}
        />
    );
}