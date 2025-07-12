namespace BackendLogic.controller;

using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

[ApiController]
[Route("api/[controller]")]
public class OcrController : ControllerBase
{
    private readonly HttpClient _httpClient;

    public OcrController(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
    }

    [HttpPost("analyze")]
    public async Task<IActionResult> AnalyzeImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var requestContent = new MultipartFormDataContent();
        var streamContent = new StreamContent(file.OpenReadStream());
        streamContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);
        requestContent.Add(streamContent, "file", file.FileName);

        try
        {
            var pythonApiUrl = "http://localhost:8001/analyze"; // Python endpoint
            var response = await _httpClient.PostAsync(pythonApiUrl, requestContent);

            var responseContent = await response.Content.ReadAsStringAsync();
            return Content(responseContent, "application/json");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error contacting OCR service: {ex.Message}");
        }
    }
}
