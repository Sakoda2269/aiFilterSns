package com.takotyann.aisns;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.Cookie;

@AutoConfigureMockMvc
@SpringBootTest()
public class FollowTest {
	
	@Autowired
	private MockMvc mockMvc;
	
	ObjectMapper mapper = new ObjectMapper();
	
	@Test
	public void createAccountAndFollow() throws Exception {
		
		mockMvc.perform(
			post("/api/accounts/signup")
			.contentType(MediaType.APPLICATION_FORM_URLENCODED)
			.param("email", "test2@gmail.com")
			.param("name", "sakoda2")
			.param("password", "tako2")
		).andDo(print())
		.andExpect(status().isOk());
		
		mockMvc.perform(
				post("/api/accounts/signup")
				.contentType(MediaType.APPLICATION_FORM_URLENCODED)
				.param("email", "test3@gmail.com")
				.param("name", "sakoda3")
				.param("password", "tako3")
			).andDo(print())
			.andExpect(status().isOk());
	
		MvcResult  res = mockMvc.perform(
				post("/api/login")
				.contentType(MediaType.APPLICATION_FORM_URLENCODED)
				.param("email", "test2@gmail.com")
				.param("password", "tako2")
			).andDo(print())
			.andExpect(status().isOk())
			.andReturn();
			
			String cookie = res.getResponse().getHeader("Set-Cookie");
			String token = cookie.split(";")[0].split("=")[1];
		
		MvcResult res2 = mockMvc.perform(
			get("/api/accounts")
			.cookie(new Cookie("token", token))
		).andDo(print())
		.andExpect(status().isOk())
		.andReturn();
		
		String accounts = res2.getResponse().getContentAsString();
		List<Map<String, String>> map = mapper.readValue(accounts, List.class);
		for(Map<String, String> m : map) {
			if(m.get("name").equals("sakoda2")) {
				continue;
			}
			mockMvc.perform(
				put("/api/accounts/" + m.get("accountId") + "/follow")
				.cookie(new Cookie("token", token))
			).andDo(print())
			.andExpect(status().isOk());
		}
		
	}
	
}
