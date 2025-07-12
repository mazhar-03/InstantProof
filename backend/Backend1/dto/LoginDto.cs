using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace DefaultNamespace;

public class LoginDto
{
    [Required] 
    public string Username { get; set; }
    
    [Required] 
    public string Password { get; set; }
}