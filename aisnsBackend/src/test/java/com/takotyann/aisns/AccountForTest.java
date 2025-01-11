package com.takotyann.aisns;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.Cookie;
import lombok.Data;
@Data
public class AccountForTest {
	private final MockMvc mockMvc;
	private static ObjectMapper mapper = new ObjectMapper();
	
	private final String email;
	private final String name;
	private final String password;
	private String id;
	private String token;
	
	AccountForTest(String email, String name, String password, MockMvc mock) throws Exception {
		this.email = email;
		this.name = name;
		this.password = password;
		this.mockMvc = mock;
		MvcResult res = mockMvc.perform(
				post("/api/accounts/signup")
				.contentType(MediaType.APPLICATION_FORM_URLENCODED)
				.param("email", email)
				.param("name", name)
				.param("password", password)
			).andDo(print())
			.andExpect(status().isOk())
			.andReturn();
		this.id = res.getResponse().getContentAsString();
		login();
	}
	 
	public void login() throws Exception {
		MvcResult  res = mockMvc.perform(
				post("/api/login")
				.contentType(MediaType.APPLICATION_FORM_URLENCODED)
				.param("email", email)
				.param("password", password)
			).andDo(print())
			.andExpect(status().isOk())
			.andReturn();
		String cookie = res.getResponse().getHeader("Set-Cookie");
		String token = cookie.split(";")[0].split("=")[1];
		this.token = token;
	}
	
	public void follow(AccountForTest account) throws Exception {
		mockMvc.perform(
				put("/api/accounts/" + account.getId() + "/follow")
				.cookie(new Cookie("token", token))
			).andDo(print())
			.andExpect(status().isOk());
	}
	
	public void posts(String contents) throws Exception {
		mockMvc.perform(
				post("/api/posts")
				.cookie(new Cookie("token", token))
				.contentType(MediaType.APPLICATION_FORM_URLENCODED)
				.param("contents", contents)
			).andDo(print())
			.andExpect(status().isOk());
	}
	
	public Map<String, Set<String>> getTimeLine() throws Exception {
		Map<String, Set<String>> result = new HashMap<>();
		MvcResult  res = mockMvc.perform(
				get("/api/posts/follows")
				.cookie(new Cookie("token", token))
			).andDo(print())
			.andExpect(status().isOk())
			.andReturn();
		Map<String, Object> body = mapper.readValue(res.getResponse().getContentAsString(), Map.class);
		List<Object> contents = (List) body.get("content");
		for(Object o : contents) {
			Map<String, String> post = (Map) o;
			if(!result.containsKey(post.get("authorId"))) {
				result.put(post.get("authorId"), new HashSet<>());
			}
			result.get(post.get("authorId")).add(post.get("contents"));
			System.out.println(post.get("authorName") + ": " + post.get("contents"));
		}
		return result;
	}
}