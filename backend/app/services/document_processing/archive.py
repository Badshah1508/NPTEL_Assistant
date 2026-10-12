import os
import zipfile
from typing import List, Dict, Any
from app.core.config import settings

class SecureArchiveExtractor:
    ALLOWED_EXTENSIONS = {'.pdf', '.pptx', '.docx', '.txt', '.md'}

    @classmethod
    def is_safe_path(cls, base_dir: str, target_path: str) -> bool:
        base = os.path.abspath(base_dir)
        target = os.path.abspath(target_path)
        return os.path.commonpath([base]) == os.path.commonpath([base, target])

    @classmethod
    def extract_zip(cls, zip_file_path: str, destination_dir: str) -> List[Dict[str, Any]]:
        """
        Safely extracts ZIP archive with strict Zip-Slip protection,
        decompression size limits, and allowed file extension validation.
        """
        os.makedirs(destination_dir, exist_ok=True)
        extracted_files: List[Dict[str, Any]] = []

        total_extracted_bytes = 0
        file_count = 0

        with zipfile.ZipFile(zip_file_path, 'r') as zf:
            for member in zf.infolist():
                # Ignore directory entries
                if member.is_dir():
                    continue

                filename = os.path.basename(member.filename)
                # Ignore hidden OS files (e.g. __MACOSX, .DS_Store)
                if filename.startswith('.') or member.filename.startswith('__MACOSX'):
                    continue

                _, ext = os.path.splitext(filename.lower())
                if ext not in cls.ALLOWED_EXTENSIONS:
                    continue

                file_count += 1
                if file_count > settings.MAX_EXTRACTED_FILES:
                    raise ValueError(f"ZIP archive exceeds max allowed file count ({settings.MAX_EXTRACTED_FILES}).")

                total_extracted_bytes += member.file_size
                if total_extracted_bytes > settings.UPLOAD_MAX_BYTES:
                    raise ValueError(f"Extracted content exceeds max decompressed size limit ({settings.UPLOAD_MAX_BYTES} bytes).")

                # Prevent Zip-Slip path traversal vulnerability
                target_path = os.path.join(destination_dir, member.filename)
                if not cls.is_safe_path(destination_dir, target_path):
                    raise ValueError(f"Security Alert: Path traversal attempt detected in archive member: {member.filename}")

                # Ensure parent directory exists safely
                os.makedirs(os.path.dirname(target_path), exist_ok=True)

                with zf.open(member) as source, open(target_path, 'wb') as target:
                    target.write(source.read())

                extracted_files.append({
                    "original_path": member.filename,
                    "filename": filename,
                    "extracted_path": target_path,
                    "file_size": member.file_size,
                    "extension": ext.lstrip('.'),
                })

        return extracted_files
