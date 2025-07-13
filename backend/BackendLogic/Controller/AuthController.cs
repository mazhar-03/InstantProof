using BackendLogic.Dto;
using BackendLogic.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BackendLogic.Controller;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly PasswordHasher<AccountDto> _passwordHasher = new();
    private readonly ITokenService _tokenService;
    private static readonly List<AccountDto> _fakeUsers = new();

    public AuthController(ITokenService tokenService)
    {
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] LoginDto user)
    {
        var account = new AccountDto() { Username = user.Username };
        account.PasswordHash = _passwordHasher.HashPassword(account, user.Password);

        _fakeUsers.Add(account);

        return Ok("User registered");
    }
    
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto user)
    {
        var account = _fakeUsers.FirstOrDefault(u => u.Username == user.Username);
        if (account == null)
            return Unauthorized("User not found");

        var result = _passwordHasher.VerifyHashedPassword(account, account.PasswordHash, user.Password);

        if (result == PasswordVerificationResult.Failed)
            return Unauthorized("Invalid password");

        var token = _tokenService.GenerateToken(account.Username);
        return Ok(new { token });
    }

}