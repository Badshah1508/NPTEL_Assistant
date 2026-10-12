import os
import zipfile
import pytest
import tempfile
from app.services.document_processing.archive import SecureArchiveExtractor

def test_safe_zip_extraction():
    with tempfile.TemporaryDirectory() as tmp_dir:
        zip_path = os.path.join(tmp_dir, "valid.zip")
        dest_dir = os.path.join(tmp_dir, "extracted")

        with zipfile.ZipFile(zip_path, "w") as zf:
            zf.writestr("Week1/Lecture01.pdf", b"%PDF-1.4 simulated pdf lecture content")
            zf.writestr("Week1/Lecture02.txt", "Text lecture notes on pipelining")

        results = SecureArchiveExtractor.extract_zip(zip_path, dest_dir)
        assert len(results) == 2
        assert os.path.exists(os.path.join(dest_dir, "Week1/Lecture01.pdf"))

def test_rejects_zip_slip_traversal():
    with tempfile.TemporaryDirectory() as tmp_dir:
        zip_path = os.path.join(tmp_dir, "malicious.zip")
        dest_dir = os.path.join(tmp_dir, "safe_target")

        with zipfile.ZipFile(zip_path, "w") as zf:
            # Dangerous path traversal member
            zf.writestr("../../../etc/evil.txt", "malicious payload")

        with pytest.raises(ValueError) as excinfo:
            SecureArchiveExtractor.extract_zip(zip_path, dest_dir)

        assert "Path traversal attempt detected" in str(excinfo.value)
