package com.takotyann.aisns;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import jakarta.servlet.http.Cookie;

@AutoConfigureMockMvc
@SpringBootTest()
public class PostTest {
	
	@Autowired
	private MockMvc mockMvc;
	
	@Test
	public void createAccountAndPost() throws Exception {
		mockMvc.perform(
				post("/api/accounts")
				.contentType(MediaType.APPLICATION_FORM_URLENCODED)
				.param("email", "test@gmail.com")
				.param("name", "sakoda")
				.param("password", "tako")
			)
		.andDo(print())
		.andExpect(status().isOk());
		MvcResult  res = mockMvc.perform(
			post("/api/login")
			.contentType(MediaType.APPLICATION_FORM_URLENCODED)
			.param("email", "test@gmail.com")
			.param("password", "tako")
		).andDo(print())
		.andExpect(status().isOk())
		.andReturn();
		
		String cookie = res.getResponse().getHeader("Set-Cookie");
		String token = cookie.split(";")[0].split("=")[1];
		
		mockMvc.perform(
			post("/api/posts")
			.cookie(new Cookie("token", token))
			.contentType(MediaType.APPLICATION_FORM_URLENCODED)
			.param("contents", "hello world")
		).andDo(print())
		.andExpect(status().isOk());
	}
	
}
