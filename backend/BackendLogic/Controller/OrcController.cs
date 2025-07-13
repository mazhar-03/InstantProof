using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendLogic.Controller;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/ocr")]
public class OcrController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<OcrController> _logger;

    public OcrController(IHttpClientFactory httpClientFactory, ILogger<OcrController> logger)
    {
        _httpClient = httpClientFactory.CreateClient();
        _logger = logger;
    }

    [Authorize]
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
            var pythonApiUrl = "http://localhost:8001/analyze";
            var requestMessage = new HttpRequestMessage(HttpMethod.Post, pythonApiUrl)
            {
                Content = requestContent
            };

            if (Request.Headers.TryGetValue("Authorization", out var authHeader))
            {
                var authHeaderValue = authHeader.ToString();
                _logger.LogInformation("Authorization header received in C#: {AuthHeader}", authHeaderValue);

                requestMessage.Headers.Authorization = System.Net.Http.Headers.AuthenticationHeaderValue.Parse(authHeaderValue);
            }
            else
            {
                _logger.LogWarning("Authorization header missing in incoming request.");
            }

            var response = await _httpClient.SendAsync(requestMessage);
            var responseContent = await response.Content.ReadAsStringAsync();

            return Content(responseContent, "application/json");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error contacting OCR service");
            return StatusCode(500, $"Error contacting OCR service: {ex.Message}");
        }
    }
}
