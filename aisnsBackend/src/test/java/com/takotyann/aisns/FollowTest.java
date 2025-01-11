package com.takotyann.aisns;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.Cookie;
import lombok.Data;

@AutoConfigureMockMvc
@SpringBootTest()
public class FollowTest {
	
	@Autowired
	private MockMvc mockMvc;
	
	ObjectMapper mapper = new ObjectMapper();
	
	@Test
	public void createAccountAndFollow() throws Exception {
		
		Account account1 = new Account("test2@gmail.com", "sakoda2", "tako2");
		Account account2 = new Account("test3@gmail.com", "sakoda3", "tako3");
		Account account3 = new Account("test4@gmail.com", "sakoda4", "tako4");
		Account account4 = new Account("test5@gmail.com", "sakoda5", "tako5");
		
		account1.follow(account2);
		account1.follow(account3);
		
		account1.posts("i am sakoda2");
		account2.posts("hello world");
		account3.posts("good morning");
		account3.posts("i am in Tokyo");
		account4.posts("have a nice day");
		
		Map<String, Set<String>> correct = new HashMap<>();
		correct.put(account1.getId(), new HashSet<>());
		correct.put(account2.getId(), new HashSet<>());
		correct.put(account3.getId(), new HashSet<>());
		correct.get(account1.getId()).add("i am sakoda2");
		correct.get(account2.getId()).add("hello world");
		correct.get(account3.getId()).add("good morning");
		correct.get(account3.getId()).add("i am in Tokyo");
		
		var res = account1.getTimeLine();
		assertEquals(correct, res);
	}
	
	
	@Data
	class Account {
		private final String email;
		private final String name;
		private final String password;
		private String id;
		private String token;
		
		Account(String email, String name, String password) throws Exception {
			this.email = email;
			this.name = name;
			this.password = password;
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
		
		public void follow(Account account) throws Exception {
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
}
