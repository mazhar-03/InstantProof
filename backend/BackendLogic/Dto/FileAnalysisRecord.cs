namespace DefaultNamespace;

public class FileAnalysisRecord
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string FileName { get; set; }
    public string FilePath { get; set; }
    public string? AnalysisJson { get; set; }
    public DateTime Timestamp { get; set; }
}
